import db from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, generateImage, category, model, apiKey: providedApiKey, onlyImage } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Get Gemini API key
        let apiKey = providedApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            try {
                const settingsDoc = await db.collection('settings').doc('ai_api_key').get();
                if (settingsDoc.exists) {
                    apiKey = settingsDoc.data().value;
                }
            } catch (dbError) {
                console.warn('Failed to fetch API key from DB:', dbError);
            }
        }

        if (!apiKey) {
            return res.status(500).json({
                error: 'Gemini API key not configured',
                message: 'Please configure it in the Admin Panel'
            });
        }

        let parsedContent = { title: prompt, content: '', summary: '' };
        let successfulModel = '';

        // 1. GENERACIÓN DE TEXTO (Solo si NO es onlyImage)
        if (!onlyImage) {
            const modelsToTry = [];
            if (model) modelsToTry.push(model);
            if (!modelsToTry.includes('gemini-2.5-flash')) modelsToTry.push('gemini-2.5-flash');
            if (!modelsToTry.includes('gemini-1.5-flash')) modelsToTry.push('gemini-1.5-flash');
            if (!modelsToTry.includes('gemini-2.0-flash-exp')) modelsToTry.push('gemini-2.0-flash-exp');
            if (!modelsToTry.includes('gemini-1.0-pro-001')) modelsToTry.push('gemini-1.0-pro-001');

            const systemPrompt = `Eres un periodista profesional de un diario local de Argentina llamado "Compromiso". 
Tu tarea es generar noticias completas y bien estructuradas basadas en el tema proporcionado.
IMPORTANTE:
- Escribe en español de Argentina
- El tono debe ser profesional pero accesible
- Incluye datos interesantes
- La noticia debe tener entre 300-500 palabras
- NO incluyas el título en el contenido
- Estructura el contenido en párrafos claros

Responde SOLO en formato JSON con esta estructura exacta:
{
    "title": "Título atractivo de la noticia",
    "content": "Cuerpo completo de la noticia en varios párrafos",
    "summary": "Breve resumen de 2 líneas"
}`;

            let geminiResponse = null;
            let lastError = null;
            let geminiData = null;

            for (const modelToUse of modelsToTry) {
                console.log(`Intentando generar con modelo: ${modelToUse}`);
                try {
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`;
                    const response = await fetch(geminiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `${systemPrompt}\n\nTEMA: ${prompt}\nCATEGORÍA: ${category || 'General'}`
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.8,
                                maxOutputTokens: 2048
                            }
                        })
                    });

                    if (response.ok) {
                        geminiData = await response.json();
                        if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
                            geminiResponse = response;
                            successfulModel = modelToUse;
                            break;
                        } else {
                            lastError = { error: { message: `Modelo ${modelToUse} vacío` } };
                        }
                    } else {
                        const errorJson = await response.json();
                        lastError = errorJson;
                        console.warn(`Modelo ${modelToUse} falló:`, errorJson?.error?.message);
                    }
                } catch (err) {
                    lastError = { error: { message: err.message } };
                }
            }

            if (!geminiResponse || !geminiData) {
                throw new Error(`Error IA Texto: ${lastError?.error?.message || 'Todos los modelos fallaron'}`);
            }

            const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

            try {
                // Find the first '{' and the last '}' to extract the JSON object
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
                parsedContent = JSON.parse(jsonString);
            } catch (parseError) {
                parsedContent = {
                    title: prompt,
                    content: generatedText,
                    summary: generatedText.substring(0, 150) + '...'
                };
            }
        }

        // 2. GENERACIÓN DE IMAGEN
        let imageUrl = null;
        if (generateImage || onlyImage) {
            try {
                const imagePrompt = `Professional news photo for article: ${parsedContent.title || prompt}. 
                Style: photojournalistic, high quality, realistic, editorial photography, 4k. 
                No text, no watermarks.`;

                const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

                const imageResponse = await fetch(imagenUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: imagePrompt }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: "16:9"
                        }
                    })
                });

                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    const base64Image = imageData.predictions?.[0]?.bytesBase64Encoded;

                    if (base64Image) {
                        const imageDataUrl = `data:image/png;base64,${base64Image}`;
                        imageUrl = await uploadImage(imageDataUrl, 'ai-generated');
                    }
                } else {
                    const err = await imageResponse.json();
                    console.warn('Image generation failed:', err);
                    if (onlyImage) {
                        throw new Error(`Error Imagen: ${err.error?.message || 'Fallo desconocido'}`);
                    }
                }
            } catch (imgError) {
                console.error('Image generation error:', imgError);
                if (onlyImage) {
                    throw imgError; // Si solo pidió imagen, lanzamos el error
                }
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                title: parsedContent.title,
                content: parsedContent.content,
                summary: parsedContent.summary,
                image: imageUrl,
                category: category || 'Locales',
                generatedAt: new Date().toISOString(),
                modelUsed: successfulModel || 'imagen-3.0'
            }
        });

    } catch (error) {
        console.error('AI Handler Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
