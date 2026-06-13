const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3600';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  suggestions: string[];
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header if needed
      ...(localStorage.getItem('token') && {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}
