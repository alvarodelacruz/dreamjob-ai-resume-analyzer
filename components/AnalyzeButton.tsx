'use client';

import React from 'react';

const AnalyzeButton: React.FC = () => {
    return (
        <button
            className="bg-[#FF5733] hover:bg-[#E64A2E] text-white font-bold py-4 px-8 rounded-lg
                transition duration-200 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={() => {
                console.log('Analizando...');
            }}
        >
            Analizar CV
        </button>
    );
};

export default AnalyzeButton;