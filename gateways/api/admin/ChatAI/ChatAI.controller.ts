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
          suggestions: ['Sprint status', 'Team velocity', 'Sprint schedule'],
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
          systemInstruction: `You are an expert AI assistant for SprintPulse, a Jira-style sprint management and agile delivery platform. You help users with:

- Sprint planning and tracking
- Team velocity and burndown analytics
- Issue, story, and ticket workflows
- Backlog grooming and prioritization
- Reports and agile delivery intelligence

Be concise, informative, and helpful. Use emojis sparingly for better readability. When discussing sprint metrics, include specific details like story points, velocity, cycle time, etc.`,
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
    if (msg.includes('sprint') || msg.includes('board')) {
      suggestions.push('Show sprint status', 'View burndown chart', 'Check blocked issues');
    } else if (msg.includes('velocity') || msg.includes('story') || msg.includes('points')) {
      suggestions.push('Velocity analytics', 'Sprint report', 'Team capacity');
    } else if (msg.includes('backlog') || msg.includes('grooming')) {
      suggestions.push('Backlog view', 'Prioritize stories', 'Estimate tasks');
    } else if (msg.includes('report') || msg.includes('analytics')) {
      suggestions.push('Daily standup', 'Weekly summary', 'Export data');
    } else if (msg.includes('block') || msg.includes('issue') || msg.includes('bug')) {
      suggestions.push('Blocked issues', 'Triage steps', 'Contact support');
    } else if (msg.includes('help') || msg.includes('how')) {
      suggestions.push('System overview', 'Navigation guide', 'Feature list');
    } else {
      // Default suggestions
      suggestions.push('Sprint status', 'Team velocity', 'Backlog');
    }

    return suggestions.slice(0, 4);
  }
}
