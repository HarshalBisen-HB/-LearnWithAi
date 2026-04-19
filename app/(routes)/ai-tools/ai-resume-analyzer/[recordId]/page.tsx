"use client"
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Report from '../_components/Report'; // Ensure this path is correct

function AiResumeAnalyzer() {
  const { recordId } = useParams();
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();
  const [aiReport, setAiReport] = useState<string | undefined>();

  useEffect(() => {
    if (recordId) {
      GetResumeAnalyzerRecord();
    }
  }, [recordId]);

  const GetResumeAnalyzerRecord = async () => {
    const result = await axios.get('/api/history?recordId=' + recordId);
    console.log(result.data);
    setPdfUrl(result.data?.metaData);
    setAiReport(result.data?.content);
  };

  return (
    <div className='grid lg:grid-cols-5 grid-cols-1 gap-4 h-screen p-4 bg-gray-50'>
      {/* Report Section */}
      <div className='col-span-2 overflow-y-auto border-r border-gray-300 pr-4'>
        <h2 className='font-bold text-xl mb-4'>AI Resume Report</h2>
        <Report aiReport={aiReport} />
      </div>

      {/* Resume Preview Section */}
      <div className='col-span-3'>
        <h2 className='font-bold text-2xl mb-5'>Resume Preview</h2>
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="100%"
            className='rounded-md shadow-md border min-h-[80vh]'
            style={{ border: 'none' }}
          />
        ) : (
          <p className='text-gray-500'>Loading PDF preview...</p>
        )}
      </div>
    </div>
  );
}

export default AiResumeAnalyzer;
