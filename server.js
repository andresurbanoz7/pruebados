require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS y permitir JSON en las solicitudes
app.use(cors());
app.use(express.json()); // 📌 NECESARIO para leer req.body en formato JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Verificar que la clave API está configurada
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: Falta la variable OPENAI_API_KEY");
    process.exit(1);
}

// Configurar API de OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat-laboral', async (req, res) => {
    const { query } = req.body; // 📌 Asegurar que req.body llega correctamente

    if (!query) {
        return res.status(400).json({ error: "Consulta vacía o mal enviada" });
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
