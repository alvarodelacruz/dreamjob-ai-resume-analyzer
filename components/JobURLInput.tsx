'use client';

import React, { useState } from 'react';

const JobURLInput: React.FC = () => {
  const [jobUrl, setJobUrl] = useState<string>('');

  return (
    <div className="w-full max-w-2xl mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        URL de la oferta de trabajo o descripción
      </label>
      <textarea
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={6}
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        placeholder="Pega la URL de la oferta o su descripción aquí..."
      />
    </div>
  );
};

export default JobURLInput;