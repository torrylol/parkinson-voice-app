import fetch from 'node-fetch';
import formData from 'form-data';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key ikke konfigurert' });
    }

    // Get audio data from request body
    const audioBuffer = req.body;

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'Ingen lydfil mottatt' });
    }

    // Create form data for OpenAI API
    const form = new formData();
    form.append('file', audioBuffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });
    form.append('model', 'whisper-1');
    form.append('language', 'no');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);

      if (response.status === 401) {
        return res.status(500).json({ error: 'Ugyldig API-nøkkel' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'For mange forespørsler. Prøv igjen om litt.' });
      }

      return res.status(500).json({
        error: errorData.error?.message || 'Transkribering feilet'
      });
    }

    const data = await response.json();

    return res.status(200).json({ text: data.text });

  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({
      error: 'En feil oppstod under transkribering: ' + error.message
    });
  }
}
