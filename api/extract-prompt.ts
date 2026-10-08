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

const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A punchy, evocative title describing the image aesthetic in 3-6 words.',
    },
    exactPrompt: {
      type: Type.STRING,
      description:
        'A comprehensive master reproduction prompt designed for modern image generators (DALL-E 3 / Midjourney v6 / Flux) that describes the scene precisely to recreate an almost identical image. 80-160 words.',
    },
    shortPrompt: {
      type: Type.STRING,
      description: 'A punchy, concise 15-25 word prompt capturing the absolute core essence.',
    },
    midjourneyPrompt: {
      type: Type.STRING,
      description:
        'Midjourney v6.1 ready prompt syntax with relevant parameters like --ar, --style raw, --v 6.1, --stylize (e.g. "cinematic still of ..., dramatic lighting, 35mm photography --ar 16:9 --style raw --v 6.1 --stylize 200").',
    },
    fluxPrompt: {
      type: Type.STRING,
      description:
        'Prompt formatted specifically for Flux.1 and Stable Diffusion XL, featuring keyword tag clusters and detailed realism markers.',
    },
    dallePrompt: {
      type: Type.STRING,
      description:
        'Prompt formatted for DALL-E 3 and Imagen 3 in expressive, detailed natural storytelling prose.',
    },
    subjectOnlyPrompt: {
      type: Type.STRING,
      description:
        'A modular prompt describing ONLY the subject, character, attire, pose, and expression, with background and style abstracted out so the user can place the subject into any new setting.',
    },
    styleOnlyPrompt: {
      type: Type.STRING,
      description:
        'A modular prompt describing ONLY the visual aesthetic, art movement, rendering technique, and medium (e.g., "in the style of 35mm Kodachrome documentary film, grainy texture, cinematic contrast..."), with the original subject replaced by "[YOUR SUBJECT HERE]".',
    },
    lightingAndColorPrompt: {
      type: Type.STRING,
      description:
        'A modular prompt describing ONLY the lighting setup, color harmony, and illumination atmosphere for lighting transfer.',
    },
    cameraAndCompositionPrompt: {
      type: Type.STRING,
      description:
        'A prompt focusing on camera gear, lens focal length (e.g. 85mm f/1.4, 24mm wide angle), perspective angle, depth of field, and framing layout.',
    },
    negativePrompt: {
      type: Type.STRING,
      description:
        'Recommended negative prompt keywords to prevent common artifacts or deviations when generating this image style (e.g., blurry, oversaturated, deformed hands, cartoonish, lowres, watermark).',
    },
    injectedPrompt: {
      type: Type.STRING,
      description:
        'If an injected subject was provided by the user, this is the exact 1:1 master reproduction prompt with the injected subject seamlessly replacing the original subject, while preserving 100% of the original background, environment, lighting physics, camera optics, composition, and artistic medium/style. If no subject was injected, return an empty string "".',
    },
    aspectRatio: {
      type: Type.STRING,
      description: 'Estimated aspect ratio (e.g. "16:9", "1:1", "9:16", "4:5", "3:2", "21:9").',
    },
    suggestedTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key visual tag keywords (e.g., "cyberpunk", "octane render", "chiaroscuro", "kodak portra", "bokeh"). 6 to 12 tags.',
    },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: 'Core protagonist, character, or focal object details.' },
            features: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific key subject traits (facial expression, garments, posture, materials).' },
          },
          required: ['description', 'features'],
        },
        style: {
          type: Type.OBJECT,
          properties: {
            medium: { type: Type.STRING, description: 'The medium (e.g. 35mm film photography, 3D digital sculpture, oil on canvas, watercolor, vector art).' },
            artMovement: { type: Type.STRING, description: 'Artistic genre or historical movement (e.g. Neo-Noir, Cyberpunk, Baroque, Vaporwave, Bauhaus, Contemporary Realism).' },
            renderingEngine: { type: Type.STRING, description: 'Rendering engine or aesthetic cues (e.g. Octane Render, Unreal Engine 5, Ray tracing, Analog film grain).' },
          },
          required: ['medium', 'artMovement'],
        },
        colorPalette: {
          type: Type.OBJECT,
          properties: {
            paletteDescription: { type: Type.STRING, description: 'Overall color temperature and harmony description.' },
            swatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING, description: 'Hex color code, e.g. #FF5733' },
                  name: { type: Type.STRING, description: 'Color name, e.g. "Neon Amber", "Deep Cobalt"' },
                  role: { type: Type.STRING, description: 'Dominant, Accent, Background, Highlight, or Shadow' },
                },
                required: ['hex', 'name', 'role'],
              },
              description: '5-6 representative colors extracted from the image with exact hex codes.',
            },
          },
          required: ['paletteDescription', 'swatches'],
        },
        lighting: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: 'Primary lighting category (e.g., Golden Hour, Volumetric God Rays, Studio Key & Rim, Chiaroscuro, Moody Ambient Neon).' },
            direction: { type: Type.STRING, description: 'Lighting direction and falloff (e.g., Soft side illumination with harsh specular highlights on hair).' },
            highlights: { type: Type.STRING, description: 'Color and intensity of highlights and shadows.' },
          },
          required: ['type', 'direction'],
        },
        composition: {
          type: Type.OBJECT,
          properties: {
            framing: { type: Type.STRING, description: 'Framing (e.g., Close-up portrait, Medium shot, Extreme wide panoramic, Dutch angle).' },
            perspective: { type: Type.STRING, description: 'Perspective and angle (e.g., Low-angle looking upward, Eye-level intimate, Bird-eye isometric).' },
            lensAndFocal: { type: Type.STRING, description: 'Estimated camera lens & depth (e.g., 85mm f/1.2 shallow depth-of-field, 24mm wide angle anamorphic).' },
          },
          required: ['framing', 'perspective'],
        },
        mood: {
          type: Type.OBJECT,
          properties: {
            atmosphere: { type: Type.STRING, description: 'The atmospheric and emotional vibe (e.g. Nostalgic melancholy, High-octane kinetic energy, Ethereal solitude).' },
            environmentalElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Atmospheric particles (e.g., airborne dust, rain droplets, volumetric fog, lens flares).' },
          },
          required: ['atmosphere', 'environmentalElements'],
        },
        textures: {
          type: Type.OBJECT,
          properties: {
            materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key material textures visible (e.g., brushed titanium, weathered aged leather, velvet, glossy vinyl, rough concrete).' },
            finish: { type: Type.STRING, description: 'Tactile surface finish quality (e.g., Matte, Iridescent, Weathered, Glossy).' },
          },
          required: ['materials', 'finish'],
        },
      },
      required: ['subject', 'style', 'colorPalette', 'lighting', 'composition', 'mood', 'textures'],
    },
    customExtraction: {
      type: Type.STRING,
      description: 'If the user provided a custom focus or question, the specific extracted insight answering it. Empty string if not requested.',
    },
  },
  required: [
    'title',
    'exactPrompt',
    'shortPrompt',
    'midjourneyPrompt',
    'fluxPrompt',
    'dallePrompt',
    'subjectOnlyPrompt',
    'styleOnlyPrompt',
    'lightingAndColorPrompt',
    'cameraAndCompositionPrompt',
    'negativePrompt',
    'injectedPrompt',
    'aspectRatio',
    'suggestedTags',
    'breakdown',
  ],
};

export default async function handler(req: any, res: any) {
  // Enable CORS
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
      image,
      mimeType = 'image/jpeg',
      mode = 'all',
      customFocus = '',
      aspects = [],
      injectedSubject = '',
      apiKey: customApiKey,
      model: customModel,
    } = body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const apiKey = (req.headers['x-gemini-api-key'] as string) || customApiKey;
    const targetModel = (req.headers['x-gemini-model'] as string) || customModel || 'gemini-3.5-flash-lite';
    const ai = getGeminiClient(apiKey);

    let cleanBase64 = image;
    let detectedMime = mimeType;
    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.*)$/);
      if (match) {
        detectedMime = match[1];
        cleanBase64 = match[2];
      }
    }

    const systemInstruction = `You are a world-class AI Art Prompt Engineer, Cinematographer, and Visual Forensics Expert specializing in reverse-engineering prompts from images for Midjourney v6.1, Flux.1, DALL-E 3, and Stable Diffusion.

Your mission is to perform a deep, forensic visual decomposition of the provided image and extract:
1. Exact master reproduction prompt that will allow modern image generators to recreate this image with high fidelity.
2. Modular prompts that isolate ONLY specific dimensions:
   - Subject-only (stripping background/style so it can be reused in any setting)
   - Style-only (abstracting the original subject into "[YOUR SUBJECT HERE]" while retaining exact art medium, brushwork, film grain, or render pipeline)
   - Lighting & Color scheme (so users can transfer this exact lighting rig to other prompts)
   - Camera & Composition specs (lens focal length, sensor, framing, angle)
3. Specialized generator prompt syntax:
   - Midjourney v6.1 (with --ar, --style raw, --v 6.1, --stylize)
   - Flux.1 / SDXL (with tags and natural descriptive flow)
   - DALL-E 3 / Imagen 3 (rich evocative natural prose)
4. Comprehensive forensic breakdown:
   - Subject anatomy, garments, facial expressions
   - Art style, medium, movements, rendering engines
   - Color palette with 5-6 real extracted hex codes (#RRGGBB) matching the image tones
   - Lighting setup, direction, highlights
   - Camera lens, focal length, perspective, framing
   - Mood, atmosphere, environmental particles
   - Textures and tactile material qualities
   - Recommended negative prompt to avoid unwanted generator artifacts.
${injectedSubject ? `
5. SUBJECT INJECTION: The user wants to replace the original subject with: "${injectedSubject}".
   Generate the 'injectedPrompt' field as the exact 1:1 master reproduction prompt, but replace the original subject with "${injectedSubject}" seamlessly adapted into the scene, retaining 100% of the original background, camera optics, lighting physics, colors, and art style.` : ''}

${customFocus ? `Special User Focus Query: "${customFocus}". Please provide a detailed response for the 'customExtraction' field answering this user inquiry thoroughly.` : ''}
${aspects && aspects.length > 0 ? `The user is specifically interested in: ${aspects.join(', ')}. Pay special attention to these dimensions.` : ''}`;

    const promptText = `Forensically analyze this image and reverse-engineer the prompt and aesthetic blueprint. Extract every visual layer with precision.${injectedSubject ? ` Injected Subject: "${injectedSubject}".` : ''}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: detectedMime,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: EXTRACTION_SCHEMA,
          temperature: 0.2,
        },
      });
    } catch (modelErr: any) {
      console.warn(`Primary model call (${targetModel}) failed, falling back to gemini-3.8-flash:`, modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: detectedMime,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: EXTRACTION_SCHEMA,
          temperature: 0.2,
        },
      });
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const parsedData = JSON.parse(responseText);
    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Error during prompt extraction:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to extract prompt from image',
      details: error?.toString(),
    });
  }
}
