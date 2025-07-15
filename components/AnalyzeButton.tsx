'use client';

import React from 'react';


async function analyzeCV(cvFile: File, jobUrl: string) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        const base64File = event.target?.result?.toString().split(',')[1];

        const response = await fetch('/api/analyze-cv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cvFile: base64File, jobUrl }),
        });

        const data = await response.json();
        console.log(data.prompt);
    };

    reader.readAsDataURL(cvFile);
}



const AnalyzeButton: React.FC<{ cvFile: File | null; jobUrl: string }> = ({ cvFile, jobUrl }) => {
    return (
        <button
            className="bg-gradient-to-r from-[#df2809] to-[#f4573b] hover:bg-[#E64A2E] text-white font-bold py-4 px-8 rounded-lg
                transition duration-200 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={() => {
                if (cvFile && jobUrl) {
                    analyzeCV(cvFile, jobUrl);
                } else {
                    console.log('Por favor, sube un CV y proporciona una URL válida.');
                }
            }}
        >
            Analizar CV
        </button>
    );
};

export default AnalyzeButton;