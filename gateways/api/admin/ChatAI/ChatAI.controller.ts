import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export class ChatAIController {
  private genAI: GoogleGenAI | null = null;
  private modelName = 'gemini-2.0-flash';

  constructor(private apiKey: string) {
    if (apiKey && apiKey !== 'your-gemini-api-key-here') {
      this.genAI = new GoogleGenAI({ apiKey });
    }
  }

  chat = async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, history } = req.body;

      if (!message?.trim()) {
        res.status(400).json({ message: 'Message is required' });
        return;
      }

      // If no API key, return fallback response
      if (!this.genAI) {
        res.json({
          response:
            'AI chat is not configured. Please set the GEMINI_API_KEY in your environment variables to enable the AI assistant.',
          suggestions: ['Turbine status', 'Power generation', 'Maintenance schedule'],
        });
        return;
      }

      // Build conversation history for context
      const contents = [];

      // Add previous messages as context
      if (history && Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-10)) {
          // Last 10 messages for context
          contents.push({
            role: msg.isUser ? 'user' : 'model',
            parts: [{ text: msg.text }],
          });
        }
      }

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Generate response using Gemini
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents,
        config: {
          systemInstruction: `You are an expert AI assistant for Sprint Pulse Operations Hub, a wind turbine monitoring and energy management system. You help users with:

- Wind turbine operations and monitoring
- Power generation analytics
- SCADA parameters and real-time data
- Maintenance schedules and troubleshooting
- Reports and business intelligence

Be concise, informative, and helpful. Use emojis sparingly for better readability. When discussing turbine parameters, include specific details like units (kW, m/s, RPM, etc.).`,
        },
      });

      const responseText = response.text || "I couldn't generate a response. Please try again.";

      // Generate follow-up suggestions based on the response
      const suggestions = this.generateSuggestions(message, responseText);

      res.json({
        response: responseText,
        suggestions,
      });
    } catch (error) {
      console.error('ChatAI error:', error);
      res.status(500).json({
        message: 'Failed to generate AI response',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  private generateSuggestions(userMessage: string, responseText: string): string[] {
    const msg = userMessage.toLowerCase();
    const suggestions: string[] = [];

    // Context-aware suggestions based on user query
    if (msg.includes('turbine') || msg.includes('wtg')) {
      suggestions.push('Show turbine status', 'View SCADA parameters', 'Check fault logs');
    } else if (msg.includes('power') || msg.includes('generation') || msg.includes('energy')) {
      suggestions.push('Power analytics', 'Generation report', 'Energy efficiency');
    } else if (msg.includes('maintenance') || msg.includes('maintain')) {
      suggestions.push('Maintenance schedule', 'Spare parts', 'Service history');
    } else if (msg.includes('report') || msg.includes('analytics')) {
      suggestions.push('Daily report', 'Weekly summary', 'Export data');
    } else if (msg.includes('troubleshoot') || msg.includes('error') || msg.includes('fault')) {
      suggestions.push('Common issues', 'Diagnostic steps', 'Contact support');
    } else if (msg.includes('help') || msg.includes('how')) {
      suggestions.push('System overview', 'Navigation guide', 'Feature list');
    } else {
      // Default suggestions
      suggestions.push('Turbine status', 'Power generation', 'Maintenance');
    }

    return suggestions.slice(0, 4);
  }
}
