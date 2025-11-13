import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import customFetch from '../utils/customFetch'; // Your custom axios instance

// Variants for Framer Motion animations
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeInOut" }
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const summaryVariants = {
    visible: {
        transition: {
            staggerChildren: 0.03, // Each child animates 0.03s after the previous one
        },
    },
};

const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export default function ImpressivePdfUploader() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Using a state machine for clarity: 'idle' -> 'loading' -> 'success' | 'error'
  const [appState, setAppState] = useState('idle');

  const handleFileChange = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      setAppState('error');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSummary('');
    setAppState('loading');

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await customFetch.post('/analyze', formData);
      if (res.data?.summary) {
        setSummary(res.data.summary);
        setAppState('success');
      } else {
        throw new Error(res.data?.message || 'Summarization failed to return content.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to summarize the PDF. Please try again.');
      setAppState('error');
    }
  }, []);

  const resetState = () => {
    setFile(null);
    setSummary('');
    setError('');
    setAppState('idle');
  };

  // --- Drag and Drop Handlers ---
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  function renderMarkdown(text) {
    return text.split('\n').map((line, index) => {
        if (line.trim() === '') return null;
        const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>');
        return <motion.p key={index} variants={lineVariants} dangerouslySetInnerHTML={{ __html: bolded }} />;
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {appState === 'idle' && (
            <motion.div key="idle" variants={childVariants} initial="hidden" animate="visible" exit="exit">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Document Analysis</h2>
              <p className="text-center text-slate-500 mb-8">Upload a legal PDF to generate a concise summary.</p>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl text-center p-10 transition-all duration-300 ${isDragging ? 'border-sky-500 bg-sky-50 scale-105' : 'border-slate-300 bg-slate-50'}`}
              >
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className={`transition-colors duration-300 ${isDragging ? 'text-sky-600' : 'text-slate-400'}`} size={48} />
                  <p className="mt-4 text-lg font-semibold text-slate-700">
                    {isDragging ? 'Drop your PDF here' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">PDF only, max 10MB</p>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </motion.div>
          )}

          {appState === 'loading' && (
            <motion.div key="loading" variants={childVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
                <FileText className="mx-auto text-sky-500" size={48} />
                <p className="mt-4 font-semibold text-slate-700">Analyzing Document:</p>
                <p className="text-sm text-slate-500 truncate mt-1">{file?.name}</p>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-8 overflow-hidden">
                    <motion.div 
                        className="bg-sky-500 h-2.5 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 15, ease: "linear" }} // Simulate long processing time
                    />
                </div>
                <p className="text-xs text-slate-400 mt-2 animate-pulse">This may take a moment...</p>
            </motion.div>
          )}

          {(appState === 'success' || appState === 'error') && (
            <motion.div key="result" variants={childVariants} initial="hidden" animate="visible" exit="exit">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Analysis Complete</h3>
                  <p className="text-sm text-slate-500 truncate">{file?.name}</p>
                </div>
                <button onClick={resetState} className="text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors">
                  Upload New
                </button>
              </div>

              {appState === 'success' && (
                <div className="max-h-[50vh] overflow-y-auto pr-4 -mr-4">
                    <motion.div variants={summaryVariants} initial="hidden" animate="visible" className="text-slate-600 space-y-3 whitespace-pre-line text-base leading-relaxed">
                        {renderMarkdown(summary)}
                    </motion.div>
                </div>
              )}

              {appState === 'error' && (
                <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
                    <XCircle className="mx-auto text-red-500" size={40}/>
                    <p className="mt-3 font-semibold text-red-800">An Error Occurred</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <button onClick={resetState} className="mt-4 bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                        Try Again
                    </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}