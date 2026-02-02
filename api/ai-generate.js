import db from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, generateImage, category, model } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Get Gemini API key from settings or environment
        let apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            try {
                // Fallback to database setting
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
                message: 'Please set GEMINI_API_KEY environment variable or configure it in the Admin Panel'
            });
        }

        // --- NEW LOGIC: FALLBACK CHAIN ---
        // Generar lista de modelos a probar en orden
        const modelsToTry = [];
        if (model) modelsToTry.push(model); // El usuario eligió uno
        if (!modelsToTry.includes('gemini-1.5-flash')) modelsToTry.push('gemini-1.5-flash'); // Fallback 1: Flash (Rápido)
        if (!modelsToTry.includes('gemini-pro')) modelsToTry.push('gemini-pro'); // Fallback 2: Legacy (Estable)
        if (!modelsToTry.includes('gemini-1.0-pro')) modelsToTry.push('gemini-1.0-pro'); // Fallback 3: Alias específico

        const systemPrompt = `Eres un periodista profesional de un diario local de Argentina llamado "Compromiso". 
Tu tarea es generar noticias completas y bien estructuradas basadas en el tema proporcionado.

IMPORTANTE:
- Escribe en español de Argentina
- El tono debe ser profesional pero accesible
- Incluye datos interesantes y relevantes
- La noticia debe tener entre 300-500 palabras
- NO incluyas el título en el contenido, solo el cuerpo de la noticia
- Estructura el contenido en párrafos claros

Responde SOLO en formato JSON con esta estructura exacta:
{
    "title": "Título atractivo de la noticia",
    "content": "Cuerpo completo de la noticia en varios párrafos",
    "summary": "Breve resumen de 2 líneas para la vista previa"
}`;

        let geminiResponse = null;
        let lastError = null;
        let successfulModel = '';
        let geminiData = null;

        // Bucle de intentos
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
                                text: `${systemPrompt}\n\nTEMA A DESARROLLAR: ${prompt}\nCATEGORÍA: ${category || 'General'}`
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
                        geminiResponse = response; // Marcamos éxito
                        successfulModel = modelToUse;
                        break; // Éxito total, salimos del bucle
                    } else {
                        // Respuesta OK pero sin texto (vacía/bloqueada)
                        lastError = { error: { message: `Modelo ${modelToUse} devolvió respuesta vacía (posible filtro de seguridad)` } };
                        console.warn(`Modelo ${modelToUse} vacío:`, geminiData);
                    }
                } else {
                    const errorJson = await response.json();
                    lastError = errorJson;
                    console.warn(`Modelo ${modelToUse} falló:`, errorJson?.error?.message);
                    // Continuar al siguiente modelo
                }
            } catch (err) {
                console.error(`Error de red con modelo ${modelToUse}:`, err);
                lastError = { error: { message: err.message } };
            }
        }

        if (!geminiResponse || !geminiData) {
            console.error('Todos los modelos fallaron. Último error:', lastError);
            return res.status(500).json({
                error: `Error IA: Todos los modelos fallaron. Último error: ${lastError?.error?.message || 'Desconocido'}`,
                details: lastError
            });
        }

        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return res.status(500).json({ error: 'No content generated (Empty response)' });
        }

        // Parse the JSON response from Gemini
        let parsedContent;
        try {
            // Clean the response in case it has markdown code blocks
            const cleanedText = generatedText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            parsedContent = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Parse error:', parseError);
            // If parsing fails, create a basic structure
            parsedContent = {
                title: prompt,
                content: generatedText,
                summary: generatedText.substring(0, 150) + '...'
            };
        }

        // Generate image if requested
        let imageUrl = null;
        if (generateImage) {
            try {
                const imagePrompt = `Professional news photo for article about: ${parsedContent.title}. 
Style: photojournalistic, high quality, editorial photography. 
No text overlays, no watermarks.`;

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
                        // Upload to Cloud Storage
                        const imageDataUrl = `data:image/png;base64,${base64Image}`;
                        imageUrl = await uploadImage(imageDataUrl, 'ai-generated');
                    }
                } else {
                    console.log('Image generation not available or failed, continuing without image');
                }
            } catch (imgError) {
                console.error('Image generation error:', imgError);
                // Continue without image
            }
        }

        // Return the generated content
        return res.status(200).json({
            success: true,
            data: {
                title: parsedContent.title,
                content: parsedContent.content,
                summary: parsedContent.summary,
                image: imageUrl,
                category: category || 'Locales',
                generatedAt: new Date().toISOString(),
                modelUsed: successfulModel
            }
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
