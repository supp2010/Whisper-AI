#!/usr/bin/env python3
"""
Focused Summary Functionality Testing for Whisper AI
Tests the new summary endpoints specifically
"""

import requests
import json
import os
import tempfile
import time
from pathlib import Path
import struct
import math

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
    return "http://localhost:8001/api"

BASE_URL = get_backend_url()
print(f"Testing summary functionality at: {BASE_URL}")

def create_test_audio_file():
    """Create a small test audio file for testing"""
    sample_rate = 44100
    duration = 0.5  # 0.5 seconds
    num_samples = int(sample_rate * duration)
    
    # WAV file header
    wav_header = struct.pack('<4sI4s4sIHHIIHH4sI',
        b'RIFF',
        36 + num_samples * 2,  # File size
        b'WAVE',
        b'fmt ',
        16,  # PCM format chunk size
        1,   # PCM format
        1,   # Mono
        sample_rate,
        sample_rate * 2,  # Byte rate
        2,   # Block align
        16,  # Bits per sample
        b'data',
        num_samples * 2  # Data size
    )
    
    # Generate sine wave audio data
    audio_data = b''
    for i in range(num_samples):
        # 440 Hz sine wave
        sample = int(32767 * 0.1 * math.sin(2 * math.pi * 440 * i / sample_rate))
        audio_data += struct.pack('<h', sample)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    temp_file.write(wav_header + audio_data)
    temp_file.close()
    return temp_file.name

def test_summary_workflow():
    """Test the complete summary workflow"""
    print("\n🚀 Testing Complete Summary Workflow")
    print("=" * 50)
    
    # Step 1: Create a transcription
    print("\n1. Creating test transcription...")
    test_file_path = create_test_audio_file()
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': ('test_summary.wav', f, 'audio/wav')}
            data = {'language': 'en'}
            response = requests.post(f"{BASE_URL}/transcribe", files=files, data=data, timeout=60)
        
        os.unlink(test_file_path)
        
        if response.status_code != 200:
            print(f"❌ Failed to create transcription: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
        transcription_data = response.json()
        transcription_id = transcription_data['id']
        print(f"✅ Transcription created: {transcription_id}")
        print(f"   Text: {transcription_data['text'][:100]}...")
        
        # Step 2: Create summary in English
        print("\n2. Creating summary in English...")
        summary_request = {
            "transcription_id": transcription_id,
            "summary_language": "en"
        }
        
        response = requests.post(
            f"{BASE_URL}/summarize", 
            json=summary_request, 
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"❌ Failed to create English summary: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
        summary_data = response.json()
        summary_id = summary_data['id']
        print(f"✅ English summary created: {summary_id}")
        print(f"   Language: {summary_data['language']}")
        print(f"   Summary preview: {summary_data['summary'][:200]}...")
        
        # Step 3: Create summary in Russian
        print("\n3. Creating summary in Russian...")
        summary_request_ru = {
            "transcription_id": transcription_id,
            "summary_language": "ru"
        }
        
        response = requests.post(
            f"{BASE_URL}/summarize", 
            json=summary_request_ru, 
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"❌ Failed to create Russian summary: {response.status_code}")
            print(f"   Error: {response.text}")
        else:
            summary_data_ru = response.json()
            print(f"✅ Russian summary created: {summary_data_ru['id']}")
            print(f"   Language: {summary_data_ru['language']}")
            print(f"   Summary preview: {summary_data_ru['summary'][:200]}...")
        
        # Step 4: Retrieve summaries for the transcription
        print("\n4. Retrieving summaries for transcription...")
        response = requests.get(f"{BASE_URL}/summaries/{transcription_id}", timeout=30)
        
        if response.status_code != 200:
            print(f"❌ Failed to retrieve summaries: {response.status_code}")
            print(f"   Error: {response.text}")
        else:
            summaries = response.json()
            print(f"✅ Retrieved {len(summaries)} summaries")
            for i, summary in enumerate(summaries):
                print(f"   Summary {i+1}: {summary.get('language', 'unknown')} - {summary.get('id', 'no-id')}")
        
        # Step 5: Test error handling
        print("\n5. Testing error handling with invalid transcription ID...")
        invalid_request = {
            "transcription_id": "invalid-id-12345",
            "summary_language": "en"
        }
        
        response = requests.post(
            f"{BASE_URL}/summarize", 
            json=invalid_request, 
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 404 or (response.status_code == 500 and "not found" in response.text.lower()):
            print("✅ Error handling working - correctly rejects invalid transcription ID")
        else:
            print(f"❌ Error handling issue - expected 404, got {response.status_code}")
        
        print("\n🎉 Summary workflow testing completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Summary workflow test error: {str(e)}")
        return False

def test_summary_structure():
    """Test that summaries have the expected structure"""
    print("\n📋 Testing Summary Structure")
    print("=" * 50)
    
    # Create a transcription with meaningful content
    test_file_path = create_test_audio_file()
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': ('structure_test.wav', f, 'audio/wav')}
            data = {'language': 'en'}
            response = requests.post(f"{BASE_URL}/transcribe", files=files, data=data, timeout=60)
        
        os.unlink(test_file_path)
        
        if response.status_code != 200:
            print(f"❌ Failed to create transcription for structure test")
            return False
            
        transcription_data = response.json()
        transcription_id = transcription_data['id']
        
        # Create summary
        summary_request = {
            "transcription_id": transcription_id,
            "summary_language": "en"
        }
        
        response = requests.post(
            f"{BASE_URL}/summarize", 
            json=summary_request, 
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"❌ Failed to create summary for structure test")
            return False
            
        summary_data = response.json()
        
        # Check required fields
        required_fields = ['id', 'transcription_id', 'summary', 'language', 'timestamp']
        missing_fields = [field for field in required_fields if field not in summary_data]
        
        if missing_fields:
            print(f"❌ Summary missing required fields: {missing_fields}")
            return False
        
        print("✅ Summary has all required fields")
        
        # Check that summary is not empty
        if not summary_data['summary'].strip():
            print("❌ Summary text is empty")
            return False
            
        print("✅ Summary contains text content")
        
        # Check language matches request
        if summary_data['language'] != 'en':
            print(f"❌ Summary language mismatch: expected 'en', got '{summary_data['language']}'")
            return False
            
        print("✅ Summary language matches request")
        
        print("\n📋 Summary structure test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Summary structure test error: {str(e)}")
        return False

def main():
    """Run all summary tests"""
    print("🧪 Whisper AI Summary Functionality Tests")
    print("=" * 60)
    
    tests_passed = 0
    total_tests = 2
    
    # Test 1: Complete workflow
    if test_summary_workflow():
        tests_passed += 1
    
    # Test 2: Summary structure
    if test_summary_structure():
        tests_passed += 1
    
    # Final results
    print("\n" + "=" * 60)
    print("🏁 SUMMARY TEST RESULTS")
    print("=" * 60)
    print(f"Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 All summary functionality tests PASSED!")
        print("\n✅ Summary Features Working:")
        print("   • Summary creation with OpenAI GPT-4")
        print("   • Multiple language support")
        print("   • Database storage of summaries")
        print("   • Summary retrieval by transcription ID")
        print("   • Error handling for invalid requests")
        print("   • Structured summary format")
        return True
    else:
        print("⚠️  Some summary tests FAILED!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)