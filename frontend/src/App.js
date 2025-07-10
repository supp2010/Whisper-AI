import React, { useState, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Components } from "./components";
import axios from "axios";

const {
  Header,
  Hero,
  UploadSection,
  TranscriptionSection,
  LanguageSelector,
  ExportSection,
  SummarySection,
  Footer,
  LoadingSpinner,
  ProgressBar
} = Components;

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [transcriptionId, setTranscriptionId] = useState("");
  const [error, setError] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (file && file.size <= 200 * 1024 * 1024) { // 200MB limit
      setUploadedFile(file);
      setUploadProgress(0);
      setError("");
      setProcessingStep("File uploaded successfully");
      
      // Process file immediately
      processFile(file);
    } else {
      setError("File size must be less than 200MB");
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setError("");
    setProcessingStep("Preparing file for transcription...");
    setUploadProgress(10);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", selectedLanguage);

      setProcessingStep("Uploading file to server...");
      setUploadProgress(25);

      // Make API call with progress tracking
      const response = await axios.post(`${API}/transcribe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(25 + (percentCompleted * 0.25)); // 25-50% for upload
        },
      });

      setProcessingStep("Processing with OpenAI Whisper...");
      setUploadProgress(75);

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      setProcessingStep("Transcription complete!");
      setUploadProgress(100);

      // Set results
      setTranscriptionResult(response.data.text);
      setTranscriptionId(response.data.id);

    } catch (error) {
      console.error("Transcription error:", error);
      setError(error.response?.data?.detail || "Transcription failed. Please try again.");
      setProcessingStep("Transcription failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setTranscriptionResult("");
    setTranscriptionId("");
    setError("");
    setUploadProgress(0);
    setProcessingStep("");
    setIsProcessing(false);
    setSummaryData(null);
  };

  const handleSummaryCreate = (summary) => {
    setSummaryData(summary);
  };

  const handleExport = (format) => {
    if (!transcriptionResult) {
      setError("No transcription to export");
      return;
    }

    const filename = `transcription_${transcriptionId ? transcriptionId.substring(0, 8) : 'export'}`;
    
    switch (format) {
      case 'txt':
        downloadTextFile(transcriptionResult, `${filename}.txt`);
        break;
      case 'json':
        const jsonData = {
          id: transcriptionId,
          text: transcriptionResult,
          filename: uploadedFile?.name,
          timestamp: new Date().toISOString(),
          language: selectedLanguage
        };
        downloadTextFile(JSON.stringify(jsonData, null, 2), `${filename}.json`);
        break;
      default:
        setError(`Export format ${format} not implemented yet`);
    }
  };

  const downloadTextFile = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        
        <UploadSection
          onFileUpload={handleFileUpload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          fileInputRef={fileInputRef}
          uploadedFile={uploadedFile}
          isProcessing={isProcessing}
          onReset={handleReset}
        />

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          disabled={isProcessing}
        />

        {error && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {(isProcessing || uploadProgress > 0) && (
          <div className="mt-8">
            <ProgressBar progress={uploadProgress} />
            <div className="text-center mt-4">
              <p className="text-gray-300">{processingStep}</p>
              {isProcessing && <LoadingSpinner />}
            </div>
          </div>
        )}

        {transcriptionResult && (
          <>
            <TranscriptionSection
              transcriptionResult={transcriptionResult}
              setTranscriptionResult={setTranscriptionResult}
              transcriptionId={transcriptionId}
              fileName={uploadedFile?.name}
            />
            <SummarySection
              transcriptionId={transcriptionId}
              onSummaryCreate={handleSummaryCreate}
            />
            <ExportSection onExport={handleExport} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
