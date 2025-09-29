'use client';

import React, { useState } from 'react';

async function analyzeCV(
  cvFile: File, 
  jobUrl: string, 
  setResult: (result: string) => void,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
    console.log('Analyzing CV:', cvFile?.name);
    console.log('Job URL:', jobUrl);
    
    // Mostrar un mensaje de carga
    setResult('Analizando tu CV, por favor espera...');
    
    // Iniciar animación de progreso
    setProgress(0);
    const progressInterval = setInterval(() => {
        setProgress((prev: number) => {
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

interface Props {
  cvFile: File | null;
  jobUrl: string;
  setResult: (result: string) => void;
}

const AnalyzeButton: React.FC<Props> = ({ cvFile, jobUrl, setResult }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    if (cvFile && jobUrl) {
      setIsAnalyzing(true);
      setIsLoading(true);
      analyzeCV(cvFile, jobUrl, (result) => {
        setResult(result);
        setIsLoading(false);
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
        onClick={handleAnalyze}
        disabled={!cvFile || !jobUrl || isLoading}
        className="relative group px-6 py-3 rounded-full font-semibold text-white
          bg-gradient-to-r from-[#FF5733] via-[#E64A2E] to-[#a31900]
          hover:from-[#E64A2E] hover:via-[#a31900] hover:to-[#FF5733]
          transition-all duration-300 transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          shadow-md hover:shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analizando...
          </div>
        ) : (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Analizar CV
          </div>
        )}
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 blur-sm"></div>
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