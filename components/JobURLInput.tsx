'use client';

import React, { useState } from 'react';

const JobURLInput: React.FC = () => {
  const [jobUrl, setJobUrl] = useState<string>('');

  return (
    <div className="w-full max-w-2xl mb-6 flex flex-col items-center">
      <label className="block text-[#E64A2E] text-lg font-medium mb-2">
        URL de la oferta de trabajo
      </label>
      <div className="w-full p-[3px] rounded-lg bg-gradient-to-r from-[#FF5733] to-[#E64A2E]">
        <textarea
          className="w-full p-4 rounded-lg bg-white focus:outline-none resize-none"
          rows={2}
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          placeholder="Pega la URL de la oferta o su descripción aquí..."
        />
      </div>
    </div>
  );
};

export default JobURLInput;