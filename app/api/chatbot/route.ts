import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message, cvContent, jobContent } = await request.json();
        console.log('Mensaje recibido:', message);
        console.log('CV Content recibido:', cvContent?.substring(0, 100));
        console.log('Job Content recibido:', jobContent?.substring(0, 100));

        // Procesar el contenido del CV si está en base64
        let processedCvContent = cvContent;
        if (cvContent?.startsWith('data:application/pdf;base64,')) {
            processedCvContent = 'CV proporcionado en formato PDF';
        }

        const prompt = `
            Eres un asistente experto en recursos humanos y análisis de CVs.
            Escribe la respuesta en español.
            NO hagas introducciones, ve directo al análisis.
            Si te piden análisis u opinión del CV, responde directamente la consulta sin introducción, en máximo 50 palabras. 
            Si te saludan o preguntan tu función, saluda y proporciona una breve descripción de tu rol.
            Usa Markdown para el formato.

            FORMATO OBLIGATORIO:
            En cada punto nuevo, SIEMPRE debe haber un salto de línea o intro (\n) antes para organizar mejor la respuesta.
            Ejemplo:
            \nExplicación del punto 1
            \nExplicación del punto 2
            \nExplicación del punto 3
            
            Contexto:
            CV: ${processedCvContent || 'No proporcionado'}
            Oferta de trabajo: ${jobContent || 'No proporcionada'}

            Pregunta del usuario:
            ${message}

            Ejemplos:
                Usuario: "Hola!"
                Tu respuesta debe ser algo como: "Hola! Soy un asistente experto en recursos humanos y análisis de CVs. 
                Puedo ayudarte a optimizar tu currículum, analizarlo para una oferta de trabajo específica o responder preguntas sobre cómo mejorar tu perfil profesional."

                Usuario: "¿Mi CV es adecuado para la oferta?"
                Tu respuesta debe ser algo como: 
                    "Sí, tu CV es adecuado para la oferta. 
                        \n-Destaca en tu CV los proyectos y experiencia en Next.js, Node.js y TypeScript. 
                        \n-Menciona tu experiencia con APIs y bases de datos NoSQL. 
                        \n-En la sección "About me", enfatiza tu capacidad de aprendizaje rápido y tu pasión por la tecnología."
                
                Usuario: "¿Qué mejoras puedo hacer a mi CV para esta oferta?"
                Tu respuesta debe ser algo como:
                    "Para mejorar tu CV para esta oferta:
                        \n-Incluye más detalles sobre proyectos específicos donde usaste Next.js y Node.js.
                        \n-Resalta cualquier experiencia con bases de datos NoSQL como MongoDB.
                        \n-Agrega certificaciones o cursos relevantes en desarrollo web y tecnologías mencionadas en la oferta.
                        \n-Optimiza la sección "About me" para reflejar habilidades y experiencias alineadas con la oferta."

                RECUERDA: OBLIGATORIO LOS SALTOS DE LÍNEA. USA UN GUIÓN (-) AL INICIO DE CADA PUNTO, CON UN SALTO DE LÍNEA ANTES.
        `;

        console.log('Enviando solicitud a Gemini...');

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': process.env.GEMINI_API_KEY!,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.7
                }
            }),
        });

        if (!response.ok) {
            console.error('Error en la respuesta de Gemini:', response.status, response.statusText);
            return NextResponse.json(
                { 
                    response: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta de nuevo.' 
                },
                { status: 200 }
            );
        }

        const data = await response.json();
        console.log('Respuesta de Gemini recibida:', data);
        
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const responseText = data.candidates[0].content.parts[0].text;
            console.log('Texto de respuesta:', responseText.substring(0, 100));
            return NextResponse.json({ response: responseText });
        } else {
            console.error('Estructura de respuesta inválida:', JSON.stringify(data));
            return NextResponse.json(
                { 
                    response: 'Lo siento, no pude generar una respuesta coherente. ¿Podrías reformular tu pregunta?' 
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error en el chatbot:', error);
        return NextResponse.json(
            { 
                response: 'Ha ocurrido un error al procesar tu pregunta. Por favor, intenta de nuevo.' 
            },
            { status: 200 }
        );
    }
}