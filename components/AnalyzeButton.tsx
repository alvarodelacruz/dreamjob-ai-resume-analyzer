'use client';

import React from 'react';

async function analyzeCV(cvFile: File, jobUrl: string, setResult: (result: string) => void) {
    console.log('Analyzing CV:', cvFile?.name);
    console.log('Job URL:', jobUrl);
    
    // Mostrar un mensaje de carga
    setResult('Analizando tu CV, por favor espera...');

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const base64File = event.target?.result?.toString().split(',')[1];
            
            console.log('Enviando solicitud a la API...');
            const response = await fetch('/api/analyze-cv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    cvFile: base64File, 
                    jobUrl 
                }),
            });

            if (!response.ok) {
                console.error(`Error de API: ${response.status} - ${await response.text()}`);
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response received');
            
            if (data.result) {
                setResult(data.result);
            } else if (data.error) {
                setResult(`Error: ${data.error}`);
            } else {
                setResult('No se pudo generar el análisis. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error in analyzeCV:', error);
            setResult(`Error al procesar la solicitud: ${error instanceof Error ? error.message : 'Desconocido'}`);
        }
    };

    reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setResult('Error al leer el archivo. Por favor, inténtalo de nuevo.');
    };

    reader.readAsDataURL(cvFile);
}

const AnalyzeButton: React.FC<{ cvFile: File | null; jobUrl: string; setResult: (result: string) => void }> = ({ cvFile, jobUrl, setResult }) => {
    return (
        <button
            className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] hover:from-[#E64A2E] hover:to-[#FF5733] text-white font-bold py-4 px-8 rounded-lg
                transition duration-200 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={() => {
                if (cvFile && jobUrl) {
                    analyzeCV(cvFile, jobUrl, setResult);
                } else {
                    let errorMsg = 'Por favor, ';
                    if (!cvFile) errorMsg += 'sube un CV';
                    if (!cvFile && !jobUrl) errorMsg += ' y ';
                    if (!jobUrl) errorMsg += 'proporciona una URL o descripción válida';
                    setResult(errorMsg);
                }
            }}
        >
            Analizar CV
        </button>
    );
};

export default AnalyzeButton;