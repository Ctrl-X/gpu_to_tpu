import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

app.post('/api/generate', async (req, res) => {
    if (!API_KEY) {
        console.error('API_KEY is missing');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
        });

        const initialCode = response.text;

        // Step 2: Verify and Fix
        const verificationPrompt = `
        You are an expert Python/TPU code reviewer.
        Review the following code which was migrated from GPU to TPU.
        Check for:
        1. Compilation errors.
        2. Correct usage of TPU libraries (torch_xla, tf.distribute.TPUStrategy).
        3. Logical correctness.

        If there are errors, fix them.
        Return ONLY the corrected code (no markdown, no explanations).
        If the code is already correct, return it as is.

        Code to verify:
        ${initialCode}
        `;

        const verificationResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: verificationPrompt,
        });

        const verifiedCode = verificationResponse.text;
        res.json({ generatedCode: verifiedCode });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

// Catch-all handler to serve index.html for client-side routing
app.use((req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
