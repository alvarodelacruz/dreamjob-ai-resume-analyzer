import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cvFile, jobUrl } = body;

        let cvText = '';
        let jobText = '';

        // Extract text from CV (PDF)
        if (cvFile) {
            const buffer = Buffer.from(cvFile, 'base64');
            const pdfData = await pdfParse(buffer);
            cvText = pdfData.text;
        }

        // Extract text from job URL
        if (jobUrl) {
            const response = await fetch(jobUrl);
            const html = await response.text();
            const $ = cheerio.load(html);
            jobText = $('body').text(); // Extract all text from the body
        }

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
        const geminiResponse = await fetch('https://gemini.googleapis.com/v1/models/text:generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer AIzaSyDnVELTa2yMfmiW2-fOD6HlcDj1G7yq4XQ`, // Tu clave de API
            },
            body: JSON.stringify({
                prompt,
                maxTokens: 1000, // Ajusta según tus necesidades
            }),
        });

        const geminiData = await geminiResponse.json();

        return NextResponse.json({ result: geminiData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}