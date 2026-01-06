import pool from './lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { prompt } = req.body;

    try {
        const client = await pool.connect();
        const { rows } = await client.query("SELECT * FROM settings WHERE key IN ('ai_api_key', 'ai_model', 'ai_enabled')");
        client.release();

        const settings = rows.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});

        if (settings.ai_enabled !== 'true') {
            return res.status(403).json({ error: 'AI Assistant is disabled' });
        }
        if (!settings.ai_api_key) {
            return res.status(400).json({ error: 'No API Key configured' });
        }

        const model = settings.ai_model || 'gemini-1.5-flash';
        const apiKey = settings.ai_api_key;

        const systemPrompt = `
            Actúa como un periodista experto y redactor de noticias.
            Tu tarea es generar un artículo periodístico completo basado en la información proporcionada.
            
            FORMATO DE SALIDA (JSON PURO):
            {
                "title": "Título impactante y corto (máx 60 caracteres)",
                "category": "Una de estas: Locales, Deportes, Policiales, Sociedad, Política, Campo, Necrológicas, Cultura, Opinión, Tech & Futuro, Viral",
                "blocks": [
                    { "type": "text", "content": "Párrafo 1..." },
                    { "type": "text", "content": "Párrafo 2..." },
                    { "type": "text", "content": "Párrafo de cierre..." }
                ]
            }
            
            REGLAS:
            1. Mantén un tono formal, objetivo y periodístico.
            2. Usa párrafos claros de longitud media.
            3. No inventes hechos, apégate al prompt. Si falta info, sé general.
            4. El JSON tiene que ser válido.
            5. El contenido en 'blocks' debe estar bien formateado.
        `;

        let generatedData = null;

        if (model.includes('gemini')) {
            // Google Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemPrompt + "\n\nINFORMACIÓN:\n" + prompt }]
                    }]
                })
            });

            if (!response.ok) throw new Error('Gemini API Error: ' + response.statusText);
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            // Clean markdown json blocks if present
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            generatedData = JSON.parse(cleanJson);

        } else {
            // OpenAI & Groq API (Compatible Interface)
            const apiUrl = model.includes('llama') || model.includes('mixtral') || model.includes('gemma')
                ? 'https://api.groq.com/openai/v1/chat/completions'
                : 'https://api.openai.com/v1/chat/completions';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error((model.includes('llama') || model.includes('mixtral') || model.includes('gemma') ? 'Groq' : 'OpenAI') + ' API Error: ' + response.statusText);
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;

            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            generatedData = JSON.parse(cleanJson);
        }

        if (generatedData) {
            return res.status(200).json(generatedData);
        } else {
            throw new Error('No data generated');
        }

    } catch (error) {
        console.error('AI Generation Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
