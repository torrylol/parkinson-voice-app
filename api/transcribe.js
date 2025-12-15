import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to use formidable
  },
};

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

    // Parse the multipart form data
    const form = formidable({ multiples: false });

    const [, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const audioFile = files.file?.[0] || files.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'Ingen lydfil mottatt' });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Read the file and create a File object
    const fileBuffer = fs.readFileSync(audioFile.filepath);
    const file = new File([fileBuffer], audioFile.originalFilename || 'audio.webm', {
      type: audioFile.mimetype || 'audio/webm'
    });

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'no',
    });

    // Clean up temp file
    fs.unlinkSync(audioFile.filepath);

    return res.status(200).json({ text: transcription.text });

  } catch (error) {
    console.error('Transcription error:', error);

    if (error.status === 401) {
      return res.status(500).json({ error: 'Ugyldig API-nøkkel' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'For mange forespørsler. Prøv igjen om litt.' });
    }

    return res.status(500).json({
      error: 'En feil oppstod under transkribering: ' + (error.message || 'Ukjent feil')
    });
  }
}
