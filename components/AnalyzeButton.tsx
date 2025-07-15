'use client';

import React from 'react';

const AnalyzeButton: React.FC = () => {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
        transition duration-200 ease-in-out transform hover:scale-105 mb-6"
      onClick={() => {
        // Aquí implementaremos la lógica de análisis
        console.log('Analizando...');
      }}
    >
      Analizar CV
    </button>
  );
};

export default AnalyzeButton;