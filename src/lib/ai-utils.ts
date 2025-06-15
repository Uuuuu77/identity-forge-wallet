
import storage from './storage';

export const getGeminiApiKey = (): string | null => {
  return storage.get('gemini_api_key');
};

export const generateAIAvatar = async (prompt: string, style: string): Promise<string> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set your API key first.');
  }

  try {
    const enhancedPrompt = `Create a detailed visual description for an avatar. The user wants an avatar that is: "${prompt}".
The desired artistic style is "${style}".

Describe the visual elements of the avatar in a few sentences. Your description will be used to generate an SVG avatar, so be descriptive about shapes, colors, and features. For example, if the prompt is "a friendly robot programmer" and style is "Robot", you could describe: "A smiling robot with a blue metallic square head, round glowing green eyes, and a small antenna on its head."

Generate a creative and descriptive text based on the user's prompt and selected style.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API response:', errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!description) {
      throw new Error('No description generated from Gemini API');
    }

    const encodedSeed = encodeURIComponent(description);
    const baseApiUrl = "https://api.dicebear.com/7.x/";
    const defaultOptions = "&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear";

    switch (style) {
        case 'robot':
            return `${baseApiUrl}bottts-neutral/svg?seed=${encodedSeed}${defaultOptions}`;
        case 'cartoon':
            return `${baseApiUrl}fun-emoji/svg?seed=${encodedSeed}`;
        case 'pixel':
            return `${baseApiUrl}pixel-art/svg?seed=${encodedSeed}${defaultOptions}`;
        case 'fantasy':
            return `${baseApiUrl}adventurer/svg?seed=${encodedSeed}${defaultOptions}`;
        case 'professional':
        default:
            return `${baseApiUrl}avataaars/svg?seed=${encodedSeed}`;
    }
  } catch (error) {
    console.error('AI Avatar generation error:', error);
    throw error;
  }
};

export const generateAgentCapabilities = async (agentName: string, description?: string): Promise<string[]> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set your API key first.');
  }

  try {
    const prompt = `Based on this AI agent name "${agentName}"${description ? ` and description "${description}"` : ''}, suggest 3-5 appropriate capabilities from this list: text, image, data, voice, code, translate. Return only the capability names separated by commas.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API response:', errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    const suggestions = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!suggestions) {
      return ['text']; // fallback
    }

    // Parse the suggestions and return valid capabilities
    const validCapabilities = ['text', 'image', 'data', 'voice', 'code', 'translate'];
    const suggested = suggestions.toLowerCase().split(',').map(s => s.trim());
    
    return suggested.filter(cap => validCapabilities.includes(cap)).slice(0, 5);
  } catch (error) {
    console.error('Agent capabilities generation error:', error);
    return ['text']; // fallback
  }
};

export const chatWithAgent = async (agentName: string, message: string, capabilities: string[]): Promise<string> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set your API key first.');
  }

  try {
    const systemPrompt = `You are an AI agent named "${agentName}" with the following capabilities: ${capabilities.join(', ')}. 
    
    Based on your capabilities, respond helpfully to user messages. Keep responses concise and relevant to your role.
    
    If asked about capabilities you don't have, politely explain that you specialize in: ${capabilities.join(', ')}.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API response:', errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      throw new Error('No response generated from agent');
    }

    return reply;
  } catch (error) {
    console.error('Agent chat error:', error);
    throw error;
  }
};
