import { User, ChatMessage } from '../types';

// Let's establish the backend REST endpoints.
const API_BASE = '/api';

export async function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Erreur lors de l'inscription.");
  }
  return response.json();
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Identifiants incorrects.");
  }
  return response.json();
}

export async function getUserStatus(email: string): Promise<User> {
  const response = await fetch(`${API_BASE}/user/status?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Impossible de récupérer le statut.");
  }
  return response.json();
}

export async function submitPaymentReference(payload: {
  email: string;
  plan: 'simple' | 'speciale';
  refSms: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE}/user/submit-pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Erreur d'envoi de la référence.");
  }
  return response.json();
}

// Admin panel requests
export async function getAdminUsers(credentials: {
  adminId: string;
  adminPass: string;
}): Promise<User[]> {
  const response = await fetch(
    `${API_BASE}/admin/users?adminId=${encodeURIComponent(
      credentials.adminId
    )}&adminPass=${encodeURIComponent(credentials.adminPass)}`
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Accès refusé au panneau administrateur.");
  }
  return response.json();
}

export async function validateUserPayment(payload: {
  adminId: string;
  adminPass: string;
  userId: string;
}): Promise<{ success: boolean; user: User }> {
  const response = await fetch(`${API_BASE}/admin/verify-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Impossible de valider cet étudiant.");
  }
  return response.json();
}

// Reset/clear users (for test and evaluation purposes in Admin)
export async function resetDatabase(payload: {
  adminId: string;
  adminPass: string;
}): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/admin/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

// Talk to AI Tutor
export async function explainWithAi(payload: {
  email: string;
  message: string;
  history: ChatMessage[];
  contextLessonId?: string;
  contextSubjectId?: string;
  images?: { name: string; data: string; mimeType: string }[];
  model?: 'gemini' | 'chatgpt';
}): Promise<{ reply: string }> {
  const response = await fetch(`${API_BASE}/gemini/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Le tuteur IA est indisponible actuellement.");
  }
  return response.json();
}

export async function explainWithAiStream(
  payload: {
    email: string;
    message: string;
    history: ChatMessage[];
    contextLessonId?: string;
    contextSubjectId?: string;
    images?: { name: string; data: string; mimeType: string }[];
    model?: 'gemini' | 'chatgpt';
  },
  onChunk: (chunk: string) => void
): Promise<string> {
  const response = await fetch(`${API_BASE}/gemini/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Le tuteur IA est indisponible actuellement." }));
    throw new Error(err.error || "Le tuteur IA est indisponible actuellement.");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Impossible d'initialiser le flux de lecture.");
  }

  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let incompleteLine = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunkText = decoder.decode(value, { stream: true });
    const combined = incompleteLine + chunkText;
    const lines = combined.split('\n');
    
    // Save the last incomplete line
    incompleteLine = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim();
        if (dataStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(parsed.text);
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e) {
          // If we fail to parse, it could be a raw chunk or incomplete segment
          console.warn("Failed to parse SSE data string:", dataStr, e);
        }
      }
    }
  }

  // Parse remaining incomplete line if any
  if (incompleteLine && incompleteLine.startsWith('data: ')) {
    const dataStr = incompleteLine.slice(6).trim();
    if (dataStr !== '[DONE]') {
      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.text) {
          fullText += parsed.text;
          onChunk(parsed.text);
        }
      } catch (e) {
        console.warn("Failed to parse remaining SSE data string:", dataStr, e);
      }
    }
  }

  return fullText;
}
