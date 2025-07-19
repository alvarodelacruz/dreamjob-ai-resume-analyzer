'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AnalysisSection {
  title: string;
  content: string;
  color: string;
  icon: JSX.Element;
}

const ResultsDisplay: React.FC<{ 
  result: string;
  originalCV?: File | null; // Añadir prop para el CV original
}> = ({ result, originalCV }) => {
  const [parsedSections, setParsedSections] = useState<AnalysisSection[]>([]);
  const [matchPercentage, setMatchPercentage] = useState<number>(65);
  const [isGeneratingCV, setIsGeneratingCV] = useState<boolean>(false);
  const [optimizationError, setOptimizationError] = useState<string>("");

  // Función para generar y descargar el CV optimizado
  const handleDownloadOptimizedCV = async () => {
    if (!result || !originalCV) {
      setOptimizationError("No se puede generar el CV optimizado. Asegúrate de haber subido un CV y realizado el análisis.");
      return;
    }

    setIsGeneratingCV(true);
    setOptimizationError("");
    
    try {
      // Leer el archivo original
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const base64File = event.target?.result?.toString().split(',')[1];
          
          // Llamar a un nuevo endpoint que creará el CV optimizado
          const response = await fetch('/api/generate-cv', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              originalCV: base64File,
              fileName: originalCV.name,
              fileType: originalCV.type,
              analysis: result
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          // Recibimos el documento optimizado como blob
          const blob = await response.blob();

          // Crear un enlace para la descarga - siempre usar .txt como extensión
          const fileName = `CV_Optimizado_ATS.pdf`;

          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
        } catch (error) {
          console.error("Error generando CV optimizado:", error);
          setOptimizationError("Error al generar el CV optimizado: " + 
            (error instanceof Error ? error.message : "Desconocido"));
        } finally {
          setIsGeneratingCV(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error leyendo archivo original:", error);
        setOptimizationError("Error al leer el archivo original");
        setIsGeneratingCV(false);
      };
      
      reader.readAsDataURL(originalCV);
      
    } catch (error) {
      console.error("Error en handleDownloadOptimizedCV:", error);
      setOptimizationError("Error al procesar el CV: " + 
        (error instanceof Error ? error.message : "Desconocido"));
      setIsGeneratingCV(false);
    }
  };

  useEffect(() => {
    if (!result || result === 'Analizando tu CV, por favor espera...') {
      return;
    }
    
    // Extraer el porcentaje del texto si está presente
    const percentageMatch = result.match(/Porcentaje de coincidencia:\s*(\d+)%/i);
    if (percentageMatch && percentageMatch[1]) {
      const extractedPercentage = parseInt(percentageMatch[1], 10);
      if (!isNaN(extractedPercentage) && extractedPercentage >= 0 && extractedPercentage <= 100) {
        setMatchPercentage(extractedPercentage);
      }
    }
    
    // Extraer secciones del texto Markdown recibido
    const sections: AnalysisSection[] = [
      {
        title: "Coincidencias Relevantes",
        content: extractSectionContent(result, "Coincidencias relevantes"),
        color: "bg-emerald-100 border-emerald-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      {
        title: "Habilidades que Faltan",
        content: extractSectionContent(result, "Habilidades o conocimientos que faltan"),
        color: "bg-amber-100 border-amber-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      },
      {
        title: "Mejoras para tu CV",
        content: extractSectionContent(result, "Cómo mejorar el CV"),
        color: "bg-blue-100 border-blue-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      },
      {
        title: "Consejos Prácticos",
        content: extractSectionContent(result, "Consejos realistas"),
        color: "bg-purple-100 border-purple-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      }
    ];
    
    setParsedSections(sections);
  }, [result]);
  
  // Función para extraer contenido resumido de cada sección
  const extractSectionContent = (markdown: string, sectionName: string): string => {
    try {
      // Buscar la sección por su título
      const regex = new RegExp(`##\\s*\\d*\\.?\\s*${sectionName}[\\s\\S]*?(?=##|$)`, 'i');
      const match = markdown.match(regex);
      
      if (!match) return "Sin información disponible";
      
      // Extraer los puntos principales (hasta 5 líneas)
      const content = match[0];
      const points = content.split('\n')
        .filter(line => line.includes('**') && !line.includes('##'))
        .slice(0, 5)
        .map(line => line.trim())
        .join('\n');
        
      return points || "Sin detalles específicos";
    } catch (error) {
      console.error("Error extracting section:", error);
      return "Error al procesar esta sección";
    }
  };

  if (!result) {
    return null;
  }
  
  if (result === 'Analizando tu CV, por favor espera...') {
    return (
      <div className="w-full max-w-5xl p-3 mt-0 bg-white rounded-lg shadow-md text-center">
        <div className="flex flex-col items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-[#E64A2E] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-lg font-bold text-gray-700">Analizando tu CV, por favor espera...</h2>
          <p className="text-gray-500 mt-2">Estamos comparando tu perfil con la oferta de trabajo</p>
        </div>
      </div>
    );
  }
  
  if (result.startsWith('Por favor')) {
    return (
      <div className="w-full max-w-5xl p-6 mt-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center text-amber-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold">Atención</h2>
        </div>
        <p className="text-gray-700">{result}</p>
      </div>
    );
  }

  return (
    <div id="results-section" className="w-full max-w-5xl mt-4   mx-auto">
      <h2 className="text-2xl font-bold mb-0 text-center">
        <span className="bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
          Resultados del análisis
        </span>
      </h2>
      {/* Indicador de porcentaje de coincidencia */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-6 w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-700">Porcentaje de coincidencia</h3>
          <span className="text-xl font-bold text-[#E64A2E]">{matchPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] h-2.5 rounded-full" 
            style={{ width: `${matchPercentage}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Compatibilidad entre tu perfil y los requisitos de la oferta
        </p>
      </div>
      
      {/* Secciones del análisis - 2 por fila, ocupando 80% del ancho */}
      {/* Secciones del análisis - 2 por fila, con menor altura */}
      <div className="w-[100%] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {parsedSections.map((section, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-xl shadow-md border-l-4 ${section.color} transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-center mb-2">
              {section.icon}
              <h3 className="ml-2 text-base font-semibold text-gray-800">{section.title}</h3>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600 text-sm">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón para descargar CV optimizado */}
      <div className="mt-6 text-center">
        <button 
          onClick={handleDownloadOptimizedCV}
          disabled={isGeneratingCV}
          className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] hover:from-[#E64A2E] hover:to-[#FF5733] text-white font-medium py-2 px-6 rounded-lg
            transition duration-200 ease-in-out transform hover:scale-105 shadow-md flex items-center mx-auto disabled:opacity-70"
        >
          {isGeneratingCV ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando CV optimizado...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar CV optimizado para ATS
            </>
          )}
        </button>
        
        {optimizationError && (
          <p className="mt-2 text-sm text-red-500">
            {optimizationError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;