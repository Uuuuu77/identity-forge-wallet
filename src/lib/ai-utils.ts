
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
    // Using the correct Gemini API endpoint for text generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed visual description for an avatar based on this prompt: "${prompt}". Focus on style, colors, facial features, and overall appearance. Keep it concise but vivid.`
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
