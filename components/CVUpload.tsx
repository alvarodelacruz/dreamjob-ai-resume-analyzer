'use client';

import React, { useState } from 'react';

const CVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="w-full max-w-2xl mb-6 flex flex-col items-center">
      <label className="block text-[#E64A2E] text-lg font-medium mb-2">
        Introduce tu CV
      </label>
      <div className="mt-2">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="block w-full text-sm text-gray-500
            [&::file-selector-button]:mr-4 
            [&::file-selector-button]:py-2 
            [&::file-selector-button]:px-4
            [&::file-selector-button]:rounded-full
            [&::file-selector-button]:border-0
            [&::file-selector-button]:text-sm
            [&::file-selector-button]:font-semibold
            [&::file-selector-button]:bg-[#FF5733]
            [&::file-selector-button]:text-white
            [&::file-selector-button]:duration-200
            hover:[&::file-selector-button]:bg-[#E64A2E]
            transition-all duration-200"
          aria-label="Seleccionar CV"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
              console.log('Archivo seleccionado:', selectedFile);
            }
          }}
        />
      </div>
      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Archivo seleccionado: {file.name}
        </p>
      )}
    </div>
  );
};

export default CVUpload;