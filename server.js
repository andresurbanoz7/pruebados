require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto asignado por Railway

// Configurar Middlewares
app.use(cors());
app.use(bodyParser.json());

// Verificar que la variable de OpenAI existe
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: Falta la variable OPENAI_API_KEY");
    process.exit(1);
}

// Configurar API de OpenAI
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
                { role: "system", content: "Eres un asesor experto en legislación laboral en Chile. Responde solo sobre temas del contrato colectivo y normas internas." },
                { role: "user", content: query }
            ],
            max_tokens: 500
        });

        res.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error("Error con OpenAI:", error);
        res.status(500).json({ error: "Error en la consulta" });
    }
});

// Iniciar Servidor
app.listen(port, () => {
    console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
