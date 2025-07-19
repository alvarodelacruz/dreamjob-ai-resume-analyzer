import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { originalCV, fileName, fileType, analysis } = body;

        if (!originalCV || !analysis) {
            return NextResponse.json({ 
                error: 'Se requiere tanto el CV original como el análisis' 
            }, { status: 400 });
        }

        console.log('Procesando CV para optimización ATS');
        
        // Convertir Base64 a Buffer para el archivo original
        const originalBuffer = Buffer.from(originalCV, 'base64');
        
        // Extraer mejoras sugeridas del análisis
        const improvementMatches = analysis.match(/## 3\. Cómo mejorar el CV[\s\S]*?(?=##|$)/i);
        const improvements = improvementMatches ? improvementMatches[0] : "";
        
        const missingSkills = analysis.match(/## 2\. Habilidades o conocimientos que faltan[\s\S]*?(?=##|$)/i);
        const skills = missingSkills ? missingSkills[0] : "";
        
        // Preparar prompt para optimizar el CV
        const prompt = `
            Escribe la respuesta en español.
            Actúa como un experto en optimización de CVs para sistemas ATS (Applicant Tracking Systems).
            
            Voy a proporcionarte:
            1. El contenido de un CV original en formato texto
            2. Un análisis de ese CV comparado con una oferta de trabajo
            3. Mejoras sugeridas para ese CV
            4. Habilidades que faltan en el CV según la oferta
            
            Tu tarea es generar una versión mejorada y optimizada del CV original que:
            1. Mantenga la estructura básica del CV original
            2. Integre las mejoras sugeridas en el análisis
            3. Optimice el contenido para superar filtros ATS
            4. Incluya palabras clave relevantes de la oferta
            5. Mejore la redacción y presentación para destacar fortalezas
            
            Importante:
            - No inventes experiencia o formación que no esté en el CV original
            - Mantén el mismo formato general, pero optimizado
            - El resultado debe ser una versión mejorada del CV original, no un documento totalmente nuevo
            
            CV ORIGINAL:
            ${await extractTextFromBuffer(originalBuffer, fileType)}
            
            MEJORAS SUGERIDAS:
            ${improvements}
            
            HABILIDADES QUE FALTAN:
            ${skills}
            
            ANÁLISIS COMPLETO:
            ${analysis}
            
            Genera una versión optimizada del CV original sin añadir información falsa, no te inventes nada

            IMPORTANTE: No escribas saludo, ni digas que cambios has hecho. Pega directamente el CV, ya que estoy usando una API REST para mejorar CV y necesito que seas directo.
        `;
        
        try {
            // Llamar a la API de Gemini para generar el CV optimizado
            console.log('Enviando solicitud a Gemini para optimizar CV');
            const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': `AIzaSyDnVELTa2yMfmiW2-fOD6HlcDj1G7yq4XQ`,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 4096,
                        temperature: 0.4
                    }
                }),
            });

            const geminiData = await geminiResponse.json();
            console.log('Respuesta de Gemini recibida');
            
            // Extraer el texto generado
            let optimizedText = "No se pudo generar el CV optimizado";
            if (geminiData.candidates && geminiData.candidates[0]?.content?.parts) {
                const parts = geminiData.candidates[0].content.parts;
                optimizedText = parts.map((part: any) => part.text || '').join(' ');
                console.log('CV optimizado generado correctamente');
            }
            
            // Generar un PDF con el texto optimizado (versión base64)
            const pdfBase64 = await generatePDFBase64(optimizedText);
            
            // Convertir el base64 a buffer
            const pdfBuffer = Buffer.from(pdfBase64, 'base64');
            
            // Devolver el PDF generado
            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="CV_Optimizado_ATS.pdf"`
                }
            });
            
        } catch (aiError) {
            console.error('Error al llamar a la API de Gemini:', aiError);
            // Si falla la generación, devolver el archivo original
            return new NextResponse(originalBuffer, {
                headers: {
                    'Content-Type': fileType || 'application/octet-stream',
                    'Content-Disposition': `attachment; filename=${encodeURIComponent('CV_Original_' + (fileName || 'cv.pdf'))}`
                }
            });
        }
        
    } catch (error) {
        console.error('Error optimizando CV:', error);
        return NextResponse.json({ 
            error: 'Error processing request', 
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Función para generar un PDF en base64 usando jsPDF en el lado del cliente
async function generatePDFBase64(text: string): Promise<string> {
    // Importamos dinámicamente jsPDF para evitar problemas con SSR
    const { default: jsPDF } = await import('jspdf');
    
    // Crear un nuevo documento PDF
    const doc = new jsPDF();
    
    // Configuración de fuente y márgenes
    const fontSize = 11;
    const lineHeight = 7;
    const marginLeft = 20;
    const marginTop = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - marginLeft * 2;
    
    // Título
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CURRICULUM VITAE OPTIMIZADO PARA ATS", pageWidth / 2, marginTop, { align: 'center' });
    
    // Separador
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop + 5, pageWidth - marginLeft, marginTop + 5);
    
    // Configuración para el contenido principal
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    
    // Dividir el texto en líneas para ajustarlo al ancho de página
    const textLines = doc.splitTextToSize(text, textWidth);
    
    // Agregar texto al documento
    let yPosition = marginTop + 15;
    
    // Función para verificar si necesitamos una nueva página
    const checkForNewPage = (height: number) => {
        if (yPosition + height > doc.internal.pageSize.getHeight() - marginTop) {
            doc.addPage();
            yPosition = marginTop;
            return true;
        }
        return false;
    };
    
    // Procesar todas las líneas
    for (let i = 0; i < textLines.length; i++) {
        // Si la línea parece un encabezado (por ejemplo, en mayúsculas), hacerla en negrita
        if (textLines[i].match(/^[A-Z\s]{5,}$/)) {
            doc.setFont("helvetica", "bold");
            
            // Agregar un poco más de espacio antes de los encabezados
            if (i > 0) {
                yPosition += 5;
                checkForNewPage(lineHeight);
            }
            
            doc.text(textLines[i], marginLeft, yPosition);
            doc.setFont("helvetica", "normal");
            yPosition += lineHeight;
        } else {
            checkForNewPage(lineHeight);
            doc.text(textLines[i], marginLeft, yPosition);
            yPosition += lineHeight;
        }
        
        // Verificar si necesitamos una nueva página para la próxima línea
        checkForNewPage(lineHeight);
    }
    
    // Convertir el PDF a base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    return pdfBase64;
}

// Función auxiliar para extraer texto de distintos tipos de archivos
async function extractTextFromBuffer(buffer: Buffer, fileType?: string): Promise<string> {
    try {
        // Si es un PDF, extraer texto con pdf-parse
        if (fileType && fileType.includes('pdf')) {
            try {
                const pdfParse = require('pdf-parse');
                const data = await pdfParse(buffer);
                return data.text;
            } catch (pdfError) {
                console.error('Error extrayendo texto de PDF:', pdfError);
                return "Error al extraer texto del PDF";
            }
        } 
        // Si es un archivo de Word, se podría usar mammoth.js
        else if (fileType && (fileType.includes('doc') || fileType.includes('word'))) {
            // En una implementación completa, usaríamos mammoth.js para DOCX
            // Como simplificación, tratamos el buffer como texto
            return buffer.toString('utf-8').substring(0, 5000);
        }
        // Para otros tipos, asumir que es texto plano
        else {
            return buffer.toString('utf-8').substring(0, 5000);
        }
    } catch (error) {
        console.error('Error extrayendo texto del buffer:', error);
        return "Error al procesar el archivo";
    }
}