import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/gpt', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // работаем через OpenRouter!
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      response: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error from OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenRouter', detail: error.response?.data });
  }
});

app.get('/', (req, res) => {
  res.send('GPT Proxy is running 🚀 (OpenRouter)');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
