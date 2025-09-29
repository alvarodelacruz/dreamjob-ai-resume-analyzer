'use client';

import React, { useState } from 'react';

const JobURLInput: React.FC<{ setJobUrl: (url: string) => void }> = ({ setJobUrl }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-lg mb-6 flex flex-col items-center">
      <label className="relative group mb-4">
        <h2 className="text-2xl font-bold text-center">
          <span className="bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
            URL de la oferta
          </span>
        </h2>
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF5733] to-[#E64A2E] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </label>

      <div className={`w-full relative transform transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        {/* Fondo con gradiente animado */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cc4628] via-[#a31900] to-[#8b1600] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
        
        <div className="relative flex items-center bg-white rounded-lg p-1">
          <div className="w-full">
            <textarea
              className="w-full p-4 rounded-lg bg-white focus:outline-none resize-none text-gray-600 placeholder-gray-400"
              rows={2}
              onChange={(e) => {
                const url = e.target.value;
                setJobUrl(url);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Pega la URL de la oferta o su descripción aquí..."
              spellCheck="false"
            />
          </div>
          
          {/* Icono decorativo */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-all duration-300 ${isFocused ? 'text-[#E64A2E]' : 'text-gray-400'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobURLInput;