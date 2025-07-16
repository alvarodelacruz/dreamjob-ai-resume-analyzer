'use client';

import React, { useState } from 'react';

async function analyzeCV(
  cvFile: File, 
  jobUrl: string, 
  setResult: (result: string) => void,
  setProgress: (progress: number) => void
) {
    console.log('Analyzing CV:', cvFile?.name);
    console.log('Job URL:', jobUrl);
    
    // Mostrar un mensaje de carga
    setResult('Analizando tu CV, por favor espera...');
    
    // Iniciar animación de progreso
    setProgress(0);
    const progressInterval = setInterval(() => {
        setProgress(prev => {
            // Incrementa hasta 98% como máximo durante la carga
            if (prev < 98) {
                return prev + Math.random() * 2;
            }
            return prev;
        });
    }, 100);

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

            // Detener la animación de progreso
            clearInterval(progressInterval);
            
            // Completar el progreso al 100%
            setProgress(100);

            if (!response.ok) {
                console.error(`Error de API: ${response.status} - ${await response.text()}`);
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response received');
            
            if (data.result) {
                setProgress(100);

                setResult(data.result);
                // Scroll a los resultados después de un breve retraso
                setTimeout(() => {
                    const resultsElement = document.getElementById('results-section');
                    if (resultsElement) {
                        resultsElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            } else if (data.error) {
                setResult(`Error: ${data.error}`);
            } else {
                setResult('No se pudo generar el análisis. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            clearInterval(progressInterval);
            setProgress(0);
            console.error('Error in analyzeCV:', error);
            setResult(`Error al procesar la solicitud: ${error instanceof Error ? error.message : 'Desconocido'}`);
        }
    };

    reader.onerror = (error) => {
        clearInterval(progressInterval);
        setProgress(0);
        console.error('FileReader error:', error);
        setResult('Error al leer el archivo. Por favor, inténtalo de nuevo.');
    };

    reader.readAsDataURL(cvFile);
}

const AnalyzeButton: React.FC<{ 
    cvFile: File | null; 
    jobUrl: string; 
    setResult: (result: string) => void 
}> = ({ cvFile, jobUrl, setResult }) => {
    const [progress, setProgress] = useState<number>(0);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    const handleAnalyze = () => {
        if (cvFile && jobUrl) {
            setIsAnalyzing(true);
            analyzeCV(cvFile, jobUrl, (result) => {
                setResult(result);
                if (result !== 'Analizando tu CV, por favor espera...') {
                    setIsAnalyzing(false);
                }
            }, setProgress);
        } else {
            let errorMsg = 'Por favor, ';
            if (!cvFile) errorMsg += 'sube un CV';
            if (!cvFile && !jobUrl) errorMsg += ' y ';
            if (!jobUrl) errorMsg += 'proporciona una URL o descripción válida';
            setResult(errorMsg);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <button
                className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] hover:from-[#E64A2E] hover:to-[#FF5733] text-white font-bold py-4 px-8 rounded-lg
                    transition duration-200 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-70 mb-2"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
            >
                {isAnalyzing ? 'Analizando...' : 'Analizar CV'}
            </button>
            
            {isAnalyzing && (
                <div className="w-full max-w-md mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div 
                            className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] h-2.5 rounded-full transition-all duration-200" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-500 text-xs text-center">
                        {progress < 100 ? 'Analizando tu CV...' : 'Análisis completado'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AnalyzeButton;