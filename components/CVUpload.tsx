'use client';

import React, { useState } from 'react';

const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                if (file.type === 'application/pdf') {
                    // Para PDFs, enviamos los datos al backend para procesar
                    const base64Data = (event.target?.result as string).split(',')[1];
                    try {
                        const response = await fetch('/api/extract-pdf', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ pdfBase64: base64Data }),
                        });
                        
                        if (!response.ok) {
                            throw new Error('Error al extraer texto del PDF');
                        }
                        
                        const { text } = await response.json();
                        console.log('Texto extraído del CV:', text.substring(0, 100) + '...');
                        resolve(text);
                    } catch (error) {
                        console.error('Error al procesar PDF:', error);
                        reject(error);
                    }
                } else {
                    // Para otros formatos, leemos como texto directamente
                    const text = event.target?.result as string;
                    console.log('Texto extraído del CV:', text.substring(0, 100) + '...');
                    resolve(text);
                }
            } catch (error) {
                console.error('Error al procesar el archivo:', error);
                reject(error);
            }
        };

        reader.onerror = (error) => {
            console.error('Error al leer el archivo:', error);
            reject(error);
        };

        if (file.type === 'application/pdf') {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    });
};

const CVUpload: React.FC<{ 
    setCvFile: (file: File | null) => void;
    setCvContent: (content: string) => void;
}> = ({ setCvFile, setCvContent }) => {
    const [fileName, setFileName] = useState<string>('');
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        
        if (selectedFile) {
            console.log('Archivo seleccionado:', selectedFile.name);
            setCvFile(selectedFile);
            setFileName(selectedFile.name);

            try {
                const text = await extractTextFromFile(selectedFile);
                console.log('Enviando contenido del CV al chatbot...');
                setCvContent(text);
            } catch (error) {
                console.error('Error procesando archivo:', error);
                setCvContent('Error al procesar el archivo');
            }
        } else {
            setCvFile(null);
            setFileName('');
            setCvContent('');
        }
    };

    return (
        <div className="w-full max-w-lg mb-6 flex flex-col items-center">
            <label className="relative group mb-4">
                <h2 className="text-2xl font-bold text-center">
                    <span className="bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
                        Introduce tu CV
                    </span>
                </h2>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF5733] to-[#E64A2E] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </label>
            <div className="w-full flex flex-col items-center">
                <div className="w-full text-center">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="mx-auto text-gray-500 text-center
                            [&::file-selector-button]:mr-4 
                            [&::file-selector-button]:py-2 
                            [&::file-selector-button]:px-4
                            [&::file-selector-button]:rounded-full
                            [&::file-selector-button]:border-0
                            [&::file-selector-button]:text-sm
                            [&::file-selector-button]:font-semibold
                            [&::file-selector-button]:bg-[#FF5733]
                            [&::file-selector-button]:text-white
                            [&::file-selector-button]:duration-200
                            hover:[&::file-selector-button]:bg-[#E64A2E]
                            transition-all duration-200"
                        aria-label="Seleccionar CV"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CVUpload;