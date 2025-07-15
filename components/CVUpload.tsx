'use client';

import React, { useState } from 'react';

const CVUpload: React.FC = () => {
  const [cv, setCV] = useState<string>('');

  return (
    <div className="w-full max-w-2xl mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Pega tu CV aquí o sube un archivo
      </label>
      <textarea
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={10}
        value={cv}
        onChange={(e) => setCV(e.target.value)}
        placeholder="Pega el contenido de tu CV aquí..."
      />
      <div className="mt-2">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={(e) => {
            // Aquí implementaremos la lógica para leer archivos
            console.log('Archivo seleccionado:', e.target.files?.[0]);
          }}
        />
      </div>
    </div>
  );
};

export default CVUpload;