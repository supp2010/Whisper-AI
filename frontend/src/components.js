import React, { useState } from "react";

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.043-.777-3.908-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Whisper AI</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="text-center py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          Transcribe
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}Audio &amp; Video
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your audio and video content into accurate text with our advanced AI-powered transcription service.
          Upload files up to 200MB and get instant results.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>99.9% Accuracy</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>100+ Languages</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Real-time Processing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const UploadSection = ({ onFileUpload, onDragOver, onDrop, fileInputRef, uploadedFile, isProcessing, onReset }) => {
  const supportedFormats = [
    { name: "MP3", color: "bg-blue-500" },
    { name: "WAV", color: "bg-green-500" },
    { name: "MP4", color: "bg-red-500" },
    { name: "MOV", color: "bg-purple-500" },
    { name: "AVI", color: "bg-yellow-500" },
    { name: "M4A", color: "bg-pink-500" }
  ];

  return (
    <section className="mb-12">
      <div className="max-w-4xl mx-auto">
        <div
          className={`border-2 border-dashed border-purple-500/50 rounded-3xl p-12 text-center bg-black/20 backdrop-blur-sm transition-all duration-300 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : "hover:border-purple-400 cursor-pointer"
          }`}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {uploadedFile ? "File Uploaded!" : "Upload Your File"}
          </h3>
          <p className="text-gray-300 mb-6">
            {uploadedFile
              ? `${uploadedFile.name} (${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB)`
              : "Drag and drop your audio or video file here, or click to browse"
            }
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {supportedFormats.map((format, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${format.color}`}
              >
                {format.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Maximum file size: 200MB
          </p>
          {uploadedFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Upload Different File
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
          />
        </div>
      </div>
    </section>
  );
};

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, disabled }) => {
  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" }
  ];

  return (
    <section className="mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Language</h2>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => !disabled && setSelectedLanguage(lang.code)}
                disabled={disabled}
                className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedLanguage === lang.code
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : disabled
                    ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TranscriptionSection = ({ transcriptionResult, setTranscriptionResult, transcriptionId, fileName }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcriptionResult);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <section className="mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Transcription Result</h2>
          <div className="text-sm text-gray-400">
            {fileName && <span>File: {fileName}</span>}
            {transcriptionId && <span className="ml-4">ID: {transcriptionId.substring(0, 8)}...</span>}
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="relative">
            <textarea
              value={transcriptionResult}
              onChange={(e) => setTranscriptionResult(e.target.value)}
              className="w-full h-64 bg-gray-900/50 text-white rounded-lg p-4 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm leading-relaxed"
              placeholder="Your transcription will appear here..."
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  copySuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                {copySuccess ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>Words: {transcriptionResult.split(" ").filter(word => word.length > 0).length}</p>
            <p>Characters: {transcriptionResult.length}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExportSection = ({ onExport }) => {
  const exportFormats = [
    { format: "txt", name: "Text File", icon: "📄" },
    { format: "docx", name: "Word Document", icon: "📝" },
    { format: "pdf", name: "PDF Document", icon: "📋" },
    { format: "json", name: "JSON Data", icon: "💾" }
  ];

  return (
    <section className="mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Export Options</h2>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportFormats.map((item) => (
              <button
                key={item.format}
                onClick={() => onExport(item.format)}
                className="flex items-center justify-center space-x-3 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center mt-2">
        <span className="text-sm text-gray-400">{progress}% Complete</span>
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center mt-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span className="ml-2 text-gray-300">Processing...</span>
    </div>
  );
};

const SummarySection = ({ transcriptionId, onSummaryCreate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("ru");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const languages = [
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文" },
    { code: "ar", name: "العربية" }
  ];

  const generateSummary = async () => {
    if (!transcriptionId) {
      setError("No transcription available for summary");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription_id: transcriptionId,
          summary_language: selectedLanguage
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSummary(result.summary);
        if (onSummaryCreate) {
          onSummaryCreate(result);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to generate summary");
      }
    } catch (err) {
      setError("Network error while generating summary");
      console.error("Summary generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <section className="mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Структурированная выжимка</h2>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          
          {/* Language Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Выберите язык для выжимки:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  disabled={isGenerating}
                  className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : isGenerating
                      ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-6">
            <button
              onClick={generateSummary}
              disabled={isGenerating || !transcriptionId}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isGenerating
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:scale-105"
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Создаю выжимку...</span>
                </div>
              ) : (
                "Создать структурированную выжимку"
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Summary Display */}
          {summary && (
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Результат:</h3>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-900/50 text-white rounded-lg p-4 border border-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
                {summary}
              </div>
            </div>
          )}

          {!transcriptionId && (
            <div className="text-center text-gray-400">
              <p>Сначала загрузите и транскрибируйте файл, чтобы создать выжимку</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-purple-500/20 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.043-.777-3.908-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Whisper AI</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Advanced AI-powered transcription service for audio and video content
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">API Documentation</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Support</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2025 Whisper AI. All rights reserved. Powered by OpenAI Whisper.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Components = {
  Header,
  Hero,
  UploadSection,
  TranscriptionSection,
  LanguageSelector,
  ExportSection,
  Footer,
  LoadingSpinner,
  ProgressBar
};