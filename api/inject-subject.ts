import { GoogleGenAI, Type } from '@google/genai';

function getGeminiClient(customKey?: string) {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('No Gemini API key provided. Please configure GEMINI_API_KEY in Vercel environment variables or provide your key in Settings.');
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-gemini-api-key, x-gemini-model'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      exactPrompt,
      originalSubject = '',
      newSubject,
      style = '',
      lighting = '',
      aspectRatio = '16:9',
      apiKey: customApiKey,
      model: customModel,
    } = body;

    if (!newSubject) {
      return res.status(400).json({ error: 'No new subject provided' });
    }
    if (!exactPrompt) {
      return res.status(400).json({ error: 'No base prompt provided' });
    }

    const apiKey = (req.headers['x-gemini-api-key'] as string) || customApiKey;
    const targetModel = (req.headers['x-gemini-model'] as string) || customModel || 'gemini-3.5-flash-lite';
    const ai = getGeminiClient(apiKey);

    const systemInstruction = `You are a world-class prompt engineer specializing in prompt subject swaps and replacement synthesis.
Given an existing exact 1:1 image prompt:
1. Replace the original subject with the newly injected subject: "${newSubject}".
2. Keep 100% of the surrounding environment, background, camera framing, focal length, depth of field, lighting physics, color temperature, and artistic medium/style intact.
3. Adapt the new subject naturally into the existing lighting, shadows, and environment.
Return a structured JSON with the swapped prompt.`;

    const promptText = `Original Prompt: "${exactPrompt}"
Original Subject: "${originalSubject}"
New Injected Subject: "${newSubject}"
Style cues: "${style}"
Lighting cues: "${lighting}"
Aspect Ratio: "${aspectRatio}"

Rewrite this prompt replacing ONLY the subject with "${newSubject}". Return the updated prompt for all engines.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        injectedPrompt: {
          type: Type.STRING,
          description: 'The master 1:1 prompt with the new injected subject replacing the original subject.',
        },
        midjourneyPrompt: {
          type: Type.STRING,
          description: `Midjourney v6.1 syntax with injected subject and --ar ${aspectRatio} --v 6.1 --style raw.`,
        },
        fluxPrompt: {
          type: Type.STRING,
          description: 'Flux.1 / SDXL syntax with injected subject and descriptive tags.',
        },
        dallePrompt: {
          type: Type.STRING,
          description: 'DALL-E 3 natural prose narrative with injected subject.',
        },
      },
      required: ['injectedPrompt', 'midjourneyPrompt', 'fluxPrompt', 'dallePrompt'],
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.2,
        },
      });
    } catch (e: any) {
      console.warn(`Primary model failed for injection (${targetModel}), falling back to gemini-3.8-flash:`, e?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.2,
        },
      });
    }

    const responseText = response.text;
    if (!responseText) throw new Error('Empty response from model');
    return res.status(200).json(JSON.parse(responseText));
  } catch (err: any) {
    console.error('Error injecting subject:', err);
    return res.status(500).json({ error: err.message || 'Failed to inject subject' });
  }
}
