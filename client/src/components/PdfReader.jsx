import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import customFetch from '../utils/customFetch';

export default function PdfUploader() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile?.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setError('');
    setFile(selectedFile);
    setLoading(true);
    setSummary('');

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await customFetch.post('/analyze',formData);
console.log(res.data);

      if (res) {
        setSummary(res.data.summary);
      } else {
        throw new Error(data.message || 'Summarization failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to summarize PDF.');
    } finally {
      setLoading(false);
    }
  };
function renderMarkdown(text) {
  const lines = text.split('\n');
  let listItems = [];

  const flushList = (keyPrefix) => {
    if (listItems.length === 0) return null;
    const rendered = (
      <ul key={`ul-${keyPrefix}`} className="list-disc ml-6 mb-2">
        {listItems.map((item, i) => (
          <li key={`${keyPrefix}-li-${i}`} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
        ))}
      </ul>
    );
    listItems = [];
    return rendered;
  };

  const formatInlineMarkdown = (line) => {
    return line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return lines.flatMap((line, index) => {
    const trimmed = line.trim();

    if (/^#{1,3} /.test(trimmed)) {
      const flushed = flushList(index);
      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#+ /, '');
      const heading = React.createElement(
        `h${level}`,
        { key: `h-${index}`, className: `mt-2 mb-1 font-semibold text-${level === 1 ? '2xl' : level === 2 ? 'xl' : 'lg'}` },
        text
      );
      return [flushed, heading].filter(Boolean);
    }

    if (/^[-*] /.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*] /, ''));
      return [];
    }

    const flushed = flushList(index);

    if (trimmed === '') return flushed || null;

    const formatted = (
      <p
        key={`p-${index}`}
        className="text-gray-700 text-sm mb-1"
        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
      />
    );

    return [flushed, formatted].filter(Boolean);
  });
}

  return (
    <>
    <div className="flex flex-col px-[20vw]  pt-12  p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-12"
      >
        <h2 className="text-[24px] font-medium text-center mb-4 text-[#202020]">
          📄 Upload Legal Document for Summary
        </h2>

        {/* Upload Box */}
        <div className="flex flex-col items-center gap-6">
          <div className="sm:w-1/2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 text-center p-6">
            <label className="cursor-pointer w-full">
              <UploadCloud className="mx-auto text-blue-600 mb-2" size={40} />
              <p className="text-sm text-blue-600">Click to upload or drag & drop</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Loading & Summary */}
          
        </div>
      </motion.div>
      

    </div>
    {/* summary */}
    <div className='flex justify-center items-center pb-12 px-7 gap-1'>
  <div className='shadow-[0px_25px_50px_-12px] mt-12 bg-white w-[95vw] min-h-[40vh] rounded-[12px] p-4'>
    {/* Header */}
    <div className='bg-white'>
      <h1 className='font-normal text-[20px] leading-[20px] text-[#202020] p-2'>
       Summarized Document
      </h1>
    </div>

    {/* Summary */}
    {loading ? (
      <p className="text-[#202020] font-medium mt-4">Summarizing PDF...</p>
    ) : summary ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#F9F7F2] border border-[#E5E7EB] shadow-md p-4 rounded w-full mt-4"
      >

        <p className="text-gray-700 text-sm whitespace-pre-line">{renderMarkdown(summary)}</p>
      </motion.div>
    ) :  <div className='min-w-[90vw] min-h-[35vh] flex justify-center bg-[#F9F7F2] rounded-[8px] items-center' >

    </div> }
  </div>

</div>
    </>
  );
}
