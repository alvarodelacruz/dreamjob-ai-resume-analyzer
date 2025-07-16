'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

const ResultsDisplay: React.FC<{ result: string }> = ({ result }) => {
  console.log('Result received:', result);
  return (
    <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Resultados del análisis</h2>
      <div className="text-gray-700 prose">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ResultsDisplay;