import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the PDF.js worker from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfReader() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid PDF file.');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-xl p-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800">
          📄 Smart PDF Reader
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Upload Section */}
          <div className="w-full sm:w-1/3 border-2 border-dashed border-blue-400 p-6 rounded-lg bg-blue-50 text-center">
            <label className="cursor-pointer block">
              <UploadCloud className="mx-auto text-blue-600 mb-2" size={40} />
              <p className="text-sm text-blue-600 mb-2">Click to upload or drag & drop</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          {/* PDF Preview */}
          <div className="w-full sm:w-2/3 max-h-[60vh] overflow-auto bg-gray-100 border p-3 rounded-lg">
            {file ? (
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading="Loading PDF...">
                {Array.from(new Array(numPages), (_, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1.1} />
                ))}
              </Document>
            ) : (
              <div className="text-center text-gray-500 italic">No PDF loaded yet.</div>
            )}
          </div>
        </div>

        {/* Summary Placeholder */}
        {file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white border-l-4 border-blue-600 shadow-md p-4 rounded"
          >
            <h3 className="text-lg font-semibold text-blue-800">📌 Document Summary</h3>
            <p className="text-gray-700 mt-2 text-sm leading-relaxed">
              This area will display the key highlights and summary of your legal document.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
