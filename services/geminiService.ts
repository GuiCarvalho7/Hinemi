import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { DevotionalContent } from '../types';
import { GEMINI_AUDIO_MODEL, GEMINI_TEXT_MODEL } from '../constants';

// Helper functions for audio decoding
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Function to check and select API key, now returns the key string
export async function ensureApiKeySelected(): Promise<string | null> {
  let currentApiKey: string | null = null;

  if (typeof window.aistudio !== 'undefined' && window.aistudio.hasSelectedApiKey) {
    let hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      console.log('No API key selected, opening selection dialog...');
      await window.aistudio.openSelectKey();
      // Assume success after opening dialog, as per guidelines to prevent race condition.
      // Re-check hasSelectedApiKey or assume process.env.API_KEY is now populated.
      // For this environment, we must strictly rely on process.env.API_KEY after selection.
    }
    currentApiKey = process.env.API_KEY || null;
  } else {
    // If aistudio is not available, assume API_KEY is set via environment for development/testing
    console.warn('`window.aistudio` is not available. Ensure API_KEY is set via environment variables.');
    currentApiKey = process.env.API_KEY || null;
  }
  return currentApiKey;
}

export const generateDevotional = async (
  apiKey: string,
  moodOrTheme: string,
  basePrompt: string,
): Promise<DevotionalContent> => {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please ensure it's available.");
  }
  // Initialize GoogleGenAI right before the API call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const fullPrompt = `${basePrompt} O usuário descreve seu humor/necessidade/tema como: "${moodOrTheme}".`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.STRING, description: 'The key bible verse.' },
            reflection: { type: Type.STRING, description: 'A spiritual reflection.' },
            prayer: { type: Type.STRING, description: 'A short prayer.' },
            action: { type: Type.STRING, description: 'A practical action.' },
          },
          required: ["verse", "reflection", "prayer", "action"],
        },
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    const jsonStr = response.text?.trim();

    if (!jsonStr) {
      throw new Error("No text response from Gemini API for devotional generation.");
    }

    // Attempt to parse JSON. Sometimes the model might include markdown code blocks.
    let cleanedJsonStr = jsonStr.replace(/```json\n|\n```/g, '').trim();

    const devotional = JSON.parse(cleanedJsonStr) as DevotionalContent;
    return devotional;
  } catch (error: any) {
    console.error('Error generating devotional:', error);
    if (error.message.includes("Requested entity was not found.")) {
      console.error("API Key might be invalid or needs re-selection.");
      // In a real app, you might want to re-prompt for key selection here.
    }
    throw new Error(`Failed to generate devotional: ${error.message}`);
  }
};

export const generateAudioFromText = async (apiKey: string, text: string): Promise<AudioBuffer | null> => {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please ensure it's available.");
  }
  // Initialize GoogleGenAI right before the API call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_AUDIO_MODEL,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Using 'Kore' voice
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const outputAudioContext = new window.AudioContext({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        outputAudioContext,
        24000,
        1,
      );
      return audioBuffer;
    }
    return null;
  } catch (error: any) {
    console.error('Error generating audio:', error);
    if (error.message.includes("Requested entity was not found.")) {
      console.error("API Key might be invalid or needs re-selection.");
    }
    throw new Error(`Failed to generate audio: ${error.message}`);
  }
};

export const generateStudyExplanation = async (
  apiKey: string,
  topic: string,
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please ensure it's available.");
  }
  // Initialize GoogleGenAI right before the API call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `Explique o seguinte conceito ou passagem bíblica de forma simples, fornecendo contexto histórico se relevante e conexões com outros versículos. Use uma linguagem acessível para estudo: "${topic}". Responda em markdown.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
      },
    });

    return response.text || "Não foi possível gerar uma explicação para o tópico.";
  } catch (error: any) {
    console.error('Error generating study explanation:', error);
    if (error.message.includes("Requested entity was not found.")) {
      console.error("API Key might be invalid or needs re-selection.");
    }
    throw new Error(`Failed to generate study explanation: ${error.message}`);
  }
};

export const generateNightModeStory = async (apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please ensure it's available.");
  }
  // Initialize GoogleGenAI right before the API call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `Gere uma breve e suave história bíblica (cerca de 150-200 palavras), perfeita para o modo noite, que transmita paz e esperança. Concentre-se em temas como o amor de Deus, descanso ou cuidado divino.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 200,
      },
    });

    return response.text || "Não foi possível gerar uma história para o modo noite.";
  } catch (error: any) {
    console.error('Error generating night mode story:', error);
    if (error.message.includes("Requested entity was not found.")) {
      console.error("API Key might be invalid or needs re-selection.");
    }
    throw new Error(`Failed to generate night mode story: ${error.message}`);
  }
};