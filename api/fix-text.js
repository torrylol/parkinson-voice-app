import OpenAI from 'openai';

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

    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Tekst mangler' });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Call OpenAI GPT-4o API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Du er en assistent som rydder opp i norsk tekst. Din oppgave er å forbedre grammatikk, tegnsetting, fjerne fyllord og unødvendige gjentagelser, mens du beholder den opprinnelige meningen intakt. Returner bare den renskede teksten, ingen forklaringer.'
        },
        {
          role: 'user',
          content: `Rydd opp i denne norske teksten. Fiks grammatikk, tegnsetting, fjern fyllord og unødvendige gjentagelser, men behold meningen:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const fixedText = completion.choices?.[0]?.message?.content?.trim();

    if (!fixedText) {
      return res.status(500).json({ error: 'Kunne ikke forbedre teksten' });
    }

    return res.status(200).json({ text: fixedText });

  } catch (error) {
    console.error('Fix text error:', error);

    if (error.status === 401) {
      return res.status(500).json({ error: 'Ugyldig API-nøkkel' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'For mange forespørsler. Prøv igjen om litt.' });
    }

    return res.status(500).json({
      error: 'En feil oppstod under tekstforbedring: ' + (error.message || 'Ukjent feil')
    });
  }
}
