from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from openai import OpenAI
import aiofiles
import tempfile
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# OpenAI client
openai_client = OpenAI(
    api_key=os.environ['OPENAI_API_KEY']
)

# Create the main app without a prefix
app = FastAPI(title="Whisper AI API", description="AI-powered transcription service")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TranscriptionRequest(BaseModel):
    language: Optional[str] = "auto"

class TranscriptionResponse(BaseModel):
    id: str
    text: str
    language: str
    filename: str
    file_size: int
    duration: Optional[float] = None
    timestamp: datetime

class SummaryRequest(BaseModel):
    transcription_id: str
    summary_language: str

class SummaryResponse(BaseModel):
    id: str
    transcription_id: str
    summary: str
    language: str
    timestamp: datetime

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Whisper AI API - Ready to transcribe!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form(default="auto")
):
    """
    Transcribe audio/video file using OpenAI Whisper API
    """
    try:
        # Read file content
        content = await file.read()
        file_size = len(content)
        
        # Validate file size (200MB limit as requested)
        if file_size > 200 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File size exceeds 200MB limit")
        
        # Validate file type
        allowed_types = [
            "audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a",
            "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo",
            "audio/flac", "audio/webm", "video/webm", "audio/mp3"
        ]
        
        if file.content_type not in allowed_types:
            # Allow files with common extensions even if content-type is not recognized
            allowed_extensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mov', '.avi', '.flac', '.webm']
            file_extension = Path(file.filename).suffix.lower()
            if file_extension not in allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file type: {file.content_type}. Supported formats: MP3, WAV, M4A, MP4, MOV, AVI, FLAC, WebM"
                )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp_file:
            # Write content to temporary file
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Transcribe using OpenAI Whisper
            with open(tmp_file_path, "rb") as audio_file:
                transcript = openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language if language != "auto" else None
                )
            
            # Create transcription record
            transcription_id = str(uuid.uuid4())
            transcription_data = {
                "id": transcription_id,
                "text": transcript.text,
                "language": language,
                "filename": file.filename,
                "file_size": file_size,
                "timestamp": datetime.utcnow()
            }
            
            # Save to database
            await db.transcriptions.insert_one(transcription_data)
            
            # Return response
            return TranscriptionResponse(
                id=transcription_id,
                text=transcript.text,
                language=language,
                filename=file.filename,
                file_size=file_size,
                timestamp=transcription_data["timestamp"]
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
                
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@api_router.get("/transcriptions", response_model=List[dict])
async def get_transcriptions():
    """
    Get all transcriptions from database
    """
    try:
        transcriptions = await db.transcriptions.find().sort("timestamp", -1).to_list(100)
        return transcriptions
    except Exception as e:
        logger.error(f"Error retrieving transcriptions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve transcriptions")

@api_router.get("/transcriptions/{transcription_id}")
async def get_transcription(transcription_id: str):
    """
    Get specific transcription by ID
    """
    try:
        transcription = await db.transcriptions.find_one({"id": transcription_id})
        if not transcription:
            raise HTTPException(status_code=404, detail="Transcription not found")
        return transcription
    except Exception as e:
        logger.error(f"Error retrieving transcription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve transcription")

@api_router.delete("/transcriptions/{transcription_id}")
async def delete_transcription(transcription_id: str):
    """
    Delete a specific transcription
    """
    try:
        result = await db.transcriptions.delete_one({"id": transcription_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transcription not found")
        return {"message": "Transcription deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting transcription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete transcription")

@api_router.post("/summarize", response_model=SummaryResponse)
async def create_summary(request: SummaryRequest):
    """
    Create a structured summary of a transcription in the specified language
    """
    try:
        # Get the transcription from database
        transcription = await db.transcriptions.find_one({"id": request.transcription_id})
        if not transcription:
            raise HTTPException(status_code=404, detail="Transcription not found")
        
        transcription_text = transcription.get("text", "")
        if not transcription_text.strip():
            raise HTTPException(status_code=400, detail="Transcription text is empty")
        
        # Language mapping for prompts
        language_prompts = {
            "ru": "русском языке",
            "en": "English",
            "es": "español",
            "fr": "français", 
            "de": "Deutsch",
            "it": "italiano",
            "pt": "português",
            "ja": "日本語",
            "ko": "한국어",
            "zh": "中文",
            "ar": "العربية"
        }
        
        target_language = language_prompts.get(request.summary_language, "English")
        
        # Create structured summary prompt
        summary_prompt = f"""Please create a structured summary of the following transcription in {target_language}. 

Format the summary with these sections:
1. **Основные темы** (Main Topics) - key themes discussed
2. **Ключевые моменты** (Key Points) - most important points mentioned
3. **Выводы и заключения** (Conclusions) - main conclusions or takeaways
4. **Дополнительные детали** (Additional Details) - any noteworthy details

Make the summary comprehensive but concise, highlighting the most important information.

Transcription text:
{transcription_text}

Please provide the summary in {target_language}:"""

        # Generate summary using OpenAI GPT
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are a helpful assistant that creates structured summaries in {target_language}. Always format your response clearly with the requested sections."},
                {"role": "user", "content": summary_prompt}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        summary_text = response.choices[0].message.content
        
        # Create summary record
        summary_id = str(uuid.uuid4())
        summary_data = {
            "id": summary_id,
            "transcription_id": request.transcription_id,
            "summary": summary_text,
            "language": request.summary_language,
            "timestamp": datetime.utcnow()
        }
        
        # Save to database
        await db.summaries.insert_one(summary_data)
        
        return SummaryResponse(
            id=summary_id,
            transcription_id=request.transcription_id,
            summary=summary_text,
            language=request.summary_language,
            timestamp=summary_data["timestamp"]
        )
        
    except Exception as e:
        logger.error(f"Summary creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Summary creation failed: {str(e)}")

@api_router.get("/summaries/{transcription_id}")
async def get_summaries_for_transcription(transcription_id: str):
    """
    Get all summaries for a specific transcription
    """
    try:
        summaries = await db.summaries.find({"transcription_id": transcription_id}).sort("timestamp", -1).to_list(100)
        return summaries
    except Exception as e:
        logger.error(f"Error retrieving summaries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve summaries")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
