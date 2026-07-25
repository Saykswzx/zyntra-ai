import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Você é a Zyntra AI, uma assistente virtual amigável, altamente profissional e focada em ajudar empresas e profissionais a automatizarem rotinas de trabalho, organizarem agendas e tirarem dúvidas. Responda de forma clara, direta e objetiva. NUNCA use formatação Markdown, como asteriscos, cerquilhas ou marcadores especiais, pois o texto será exibido sem formatação. Use apenas texto limpo e simples."
                },
                {
                    role: "user",
                    content: mensagem
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const respostaIA = chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui entender.";
        res.json({ resposta: respostaIA });

    } catch (error) {
        console.error("Erro na requisição:", error);
        res.status(500).json({ error: "Erro ao comunicar com a Zyntra AI." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
