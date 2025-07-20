import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini setup
const ai = new GoogleGenAI({});

app.listen(port, () => {
	console.log(`Gemini Chatbot running on http://localhost:${port}`);
});

app.post('/api/chat', async (req, res) => {
	const userMessage = req.body.message;

	if (!userMessage) {
		return res.status(400).json({ reply: "Message is required." });
	}

	try {
		const result = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: userMessage,
		})
		const text = result.text;

		res.json({ reply: text });
	} catch (err) {
		console.error(err);
		res.status(500).json({ reply: "Something went wrong." });
	}
});
