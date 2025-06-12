
import storage from './storage';

export const getGeminiApiKey = (): string | null => {
  return storage.get('gemini_api_key');
};

export const generateAIAvatar = async (prompt: string): Promise<string> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set your API key first.');
  }

  try {
    // Using Gemini's text generation to create a detailed avatar description
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed visual description for an avatar based on this prompt: "${prompt}". Focus on style, colors, facial features, and overall appearance. Keep it concise but vivid.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!description) {
      throw new Error('No description generated from Gemini API');
    }

    // For now, return a placeholder avatar URL with the description
    // In production, you could integrate with an image generation service
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(description)}`;
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
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
