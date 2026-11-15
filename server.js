const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Pesan kosong" });

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Kamu adalah Nova, CS dari NovaTopUp (top up game). Jawab santai pakai bahasa gaul. Bantu buyer, jelasin cara top up, dan kalo minta admin bilang 'Oke saya sambungkan ke admin'." },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      },
      { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ reply: "Server AI lagi sibuk, coba lagi nanti ya." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
