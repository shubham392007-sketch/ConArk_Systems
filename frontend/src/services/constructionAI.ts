import type { ConstructionAIResponse } from '../types';

const getApiBase = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (
    typeof window !== 'undefined' &&
    (window.location.port === '5173' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:8000/api/v1';
  }
  return '/api/v1';
};

const API_BASE = getApiBase();

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onDone: () => void;
  onError: (errorMsg: string) => void;
}

export async function sendConstructionAIMessage(
  message: string,
  history: Array<{ role: string; content: string }>,
  conversationId?: string,
  projectContext?: Record<string, any>
): Promise<ConstructionAIResponse> {
  const res = await fetch(`${API_BASE}/construction-ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      conversation_id: conversationId,
      project_context: projectContext
    })
  });

  if (!res.ok) {
    let errorMsg = 'Unable to reach the intelligence service right now.';
    try {
      const err = await res.json();
      if (err.detail) errorMsg = err.detail;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function streamConstructionAIMessage(
  message: string,
  history: Array<{ role: string; content: string }>,
  callbacks: StreamCallbacks,
  conversationId?: string,
  projectContext?: Record<string, any>
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/construction-ai/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        conversation_id: conversationId,
        project_context: projectContext
      })
    });

    if (!res.ok) {
      let errorMsg = 'Unable to reach the intelligence service right now.';
      try {
        const err = await res.json();
        if (err.detail) errorMsg = err.detail;
      } catch {}
      callbacks.onError(errorMsg);
      return;
    }

    if (!res.body) {
      callbacks.onError('Streaming response body not supported.');
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6).trim();
          try {
            const data = JSON.parse(jsonStr);
            if (data.error) {
              callbacks.onError(data.message || 'ConArk AI is temporarily busy.');
              return;
            }
            if (data.chunk) {
              callbacks.onChunk(data.chunk);
            }
            if (data.done) {
              callbacks.onDone();
              return;
            }
          } catch {
            continue;
          }
        }
      }
    }
    callbacks.onDone();
  } catch (err: any) {
    callbacks.onError(err?.message || 'Unable to reach the intelligence service right now.');
  }
}
