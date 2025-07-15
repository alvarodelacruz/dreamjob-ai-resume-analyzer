import { NextResponse } from 'next/server';
// No importamos pdf-parse aquí, lo importaremos solo cuando sea necesario

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cvFile, jobUrl } = body;

        let cvText = '';
        let jobText = '';

        // Extract text from CV (PDF)
        if (cvFile) {
            try {
                console.log('Recibido archivo para procesamiento');
                // Si es una prueba simple, no intentamos parsearlo como PDF
                if (cvFile === 'test') {
                    cvText = 'Contenido de prueba del CV';
                    console.log('Usando contenido de prueba del CV');
                } else {
                    try {
                        const buffer = Buffer.from(cvFile, 'base64');
                        console.log('Buffer creado con éxito');
                        
                        // Importamos pdf-parse solo cuando sea necesario
                        try {
                            // Importación dinámica en tiempo de ejecución
                            const pdfParse = require('pdf-parse');
                            console.log('pdf-parse cargado correctamente');
                            const pdfData = await pdfParse(buffer);
                            cvText = pdfData.text;
                            console.log('CV text extracted successfully');
                        } catch (importError) {
                            console.error('Error al cargar pdf-parse:', importError);
                            cvText = 'No se pudo cargar el módulo pdf-parse. No se puede extraer texto del PDF.';
                        }
                    } catch (pdfError) {
                        console.error('Error específico de pdf-parse:', pdfError);
                        // Si falla pdf-parse, usamos el contenido como texto plano
                        cvText = 'No se pudo extraer texto del PDF. Por favor, asegúrate de que el archivo es válido.';
                    }
                }
            } catch (error) {
                console.error('Error general extracting CV text:', error);
                cvText = 'Error extracting text from CV';
            }
        }

        // Extract text from job URL
        if (jobUrl) {
            try {
                console.log('Procesando URL o texto del trabajo:', jobUrl);
                
                // Verificar si jobUrl es una URL válida
                let isUrl = false;
                try {
                    new URL(jobUrl);
                    isUrl = true;
                } catch (e) {
                    console.log('No es una URL válida, tratando como texto plano');
                }
                
                if (jobUrl === 'test') {
                    jobText = 'Contenido de prueba de la oferta de trabajo';
                    console.log('Usando contenido de prueba de la oferta');
                } else if (isUrl) {
                    try {
                        const response = await fetch(jobUrl);
                        if (!response.ok) {
                            throw new Error(`Error en la solicitud HTTP: ${response.status}`);
                        }
                        const html = await response.text();
                        // Simplificando la expresión regular para mayor compatibilidad
                        jobText = html.replace(/<[^>]*>/g, ' ')
                                 .replace(/<script[^>]*>[\s\S]*?<\/script>/g, ' ')
                                 .replace(/<style[^>]*>[\s\S]*?<\/style>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();
                        console.log('Job text extracted successfully from URL');
                    } catch (fetchError) {
                        console.error('Error fetching job URL:', fetchError);
                        jobText = 'No se pudo acceder a la URL proporcionada. Por favor, pega directamente la descripción del trabajo.';
                    }
                } else {
                    // Si no es una URL, usamos el texto directamente
                    jobText = jobUrl;
                    console.log('Usando texto proporcionado como descripción del trabajo');
                }
            } catch (error) {
                console.error('Error general extracting job text:', error);
                jobText = 'Error extracting text from job URL or description';
            }
        }

        console.log('cvText:', cvText);
        console.log('jobText:', jobText);

        // Prepare prompt
        const prompt = `
            Actúa como un asesor de carrera especializado en jóvenes sin experiencia. 
            El usuario te da su CV y una oferta de trabajo. 
            Tu tarea es comparar ambos y generar un análisis claro con estos apartados:

            1. Coincidencias relevantes entre el CV y la oferta.
            2. Habilidades o conocimientos que faltan.
            3. Cómo mejorar el CV con lo que el usuario ya tiene.
            4. Recomendaciones específicas para añadir frases, secciones o proyectos personales.
            5. Consejos realistas para alguien sin experiencia que quiera aplicar a este puesto.

            CV:
            ${cvText}

            Oferta de trabajo:
            ${jobText}
        `;

        // Send prompt to Google Gemini API
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': `AIzaSyDnVELTa2yMfmiW2-fOD6HlcDj1G7yq4XQ`, // Tu clave de API
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
                    maxOutputTokens: 2048,
                    temperature: 0.7
                }
            }),
        });

        const geminiData = await geminiResponse.json();
        console.log('Gemini API response received');

        // Extraer el texto generado de la respuesta
        let resultText = "No se pudo generar análisis";
        if (geminiData.candidates && geminiData.candidates[0]?.content?.parts) {
            const parts = geminiData.candidates[0].content.parts;
            resultText = parts.map((part: any) => part.text || '').join(' ');
        }
        return NextResponse.json({ result: resultText });
    } catch (error) {
        console.error('Error principal de la API:', error);
        return NextResponse.json({ 
            error: 'Error processing request', 
            message: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.stack : 'No stack available'
        }, { status: 500 });
    }
}