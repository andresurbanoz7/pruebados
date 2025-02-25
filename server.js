require('dotenv').config();  // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Verificar que la variable OPENAI_API_KEY está configurada
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: La variable OPENAI_API_KEY no está configurada.");
    console.error("🔎 Verifica que está en Railway y que el servidor la está leyendo correctamente.");
    process.exit(1);
}

// Configurar OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat-laboral', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Consulta vacía" });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Eres un asesor experto en legislación laboral en Chile." },
                { role: "user", content: query }
            ],
            max_tokens: 500
        });

        res.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error("❌ Error en la consulta con OpenAI:", error);
        res.status(500).json({ error: "Error en la consulta" });
    }
});

// Iniciar el Servidor
app.listen(port, () => {
    console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
