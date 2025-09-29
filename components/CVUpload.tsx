'use client';

import React, { useState } from 'react';

const CVUpload: React.FC<{ setCvFile: (file: File | null) => void }> = ({ setCvFile }) => {
  const [fileName, setFileName] = useState<string>('');
  
  return (
   <div className="w-full max-w-lg mb-6 flex flex-col items-center">
      <label className="relative group mb-4">
        <h2 className="text-2xl font-bold text-center">
          <span className="bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
            Introduce tu CV
          </span>
        </h2>
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF5733] to-[#E64A2E] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </label>
      <div className="w-full flex flex-col items-center">
        {/* Contenedor personalizado para el input file */}
        <div className="w-full text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="mx-auto text-gray-500 text-center
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
                setCvFile(selectedFile || null);
                setFileName(selectedFile?.name || '');
                console.log('Archivo seleccionado:', selectedFile);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CVUpload;