'use client';

import React from 'react';

const JobURLInput: React.FC<{ setJobUrl: (url: string) => void }> = ({ setJobUrl }) => {
  return (
    <div className="w-full max-w-lg mb-6 flex flex-col items-center">
      <label className="block text-[#E64A2E] text-lg font-medium mb-2 text-center">
        URL de la oferta de trabajo
      </label>
      <div className="w-full p-[3px] rounded-lg bg-gradient-to-r from-[#FF5733] to-[#E64A2E]">
        <textarea
          className="w-full p-4 rounded-lg bg-white focus:outline-none resize-none text-gray-600"
          rows={2}
          onChange={(e) => {
              const url = e.target.value;
              setJobUrl(url);
              console.log('URL ingresada:', url);
          }}
          placeholder="Pega la URL de la oferta o su descripción aquí..."
        />
      </div>
    </div>
  );
};

export default JobURLInput;