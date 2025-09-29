import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(request: Request) {
    try {
        const { pdfBase64 } = await request.json();
        
        // Convertir base64 a buffer
        const buffer = Buffer.from(pdfBase64, 'base64');
        
        // Extraer texto del PDF
        const data = await pdfParse(buffer);
        const text = data.text;
        
        return NextResponse.json({ text });
    } catch (error) {
        console.error('Error al extraer texto del PDF:', error);
        return NextResponse.json(
            { error: 'Error al procesar el PDF' },
            { status: 500 }
        );
    }
}