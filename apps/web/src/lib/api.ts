/**
 * Thin API client for the OrganAIzer NestJS backend.
 * Manages anonymous session tokens in localStorage and handles 401 retry.
 */
import type {
  Analysis,
  CreateSessionResponse,
  FollowUpAnswer,
  Goal,
} from '@organaizer/types';

const BASE_URL =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ||
  'http://localhost:3000/v1';

const TOKEN_KEY = 'organaizer_session_token';

// ---------------------------------------------------------------------------
// Session token helpers
// ---------------------------------------------------------------------------

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore – Safari private mode etc.
  }
}

function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Session creation
// ---------------------------------------------------------------------------

async function createSession(): Promise<string> {
  const res = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to create session: ${res.status}`);
  }
  const data = (await res.json()) as CreateSessionResponse;
  saveToken(data.token);
  return data.token;
}

/**
 * Returns a valid token, creating a new session if none exists.
 */
async function ensureToken(): Promise<string> {
  const existing = getToken();
  if (existing) return existing;
  return createSession();
}

// ---------------------------------------------------------------------------
// Fetch with auth + 401 retry
// ---------------------------------------------------------------------------

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit;
}

async function authedFetch(
  path: string,
  options: FetchOptions = {},
): Promise<Response> {
  const token = await ensureToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    body: options.body,
  });

  // On 401: clear stale token, get a fresh one, retry once.
  if (res.status === 401) {
    clearToken();
    const freshToken = await createSession();
    return fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...options.headers,
        Authorization: `Bearer ${freshToken}`,
      },
      body: options.body,
    });
  }

  return res;
}

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

export interface ApiClientError {
  status: number;
  code?: string;
  message: string;
}

async function parseError(res: Response): Promise<ApiClientError> {
  try {
    const body = (await res.json()) as {
      code?: string;
      message?: string;
      error?: { code?: string; message?: string };
    };
    return {
      status: res.status,
      code: body.code ?? body.error?.code,
      message: body.message ?? body.error?.message ?? `HTTP ${res.status}`,
    };
  } catch {
    return { status: res.status, message: `HTTP ${res.status}` };
  }
}

/**
 * POST /analyses
 * Uploads an image file and a goal; returns the Analysis object.
 */
export async function analyzeImage(
  imageFile: File | Blob,
  goal: Goal,
  filename = 'image.jpg',
): Promise<Analysis> {
  const form = new FormData();
  // FormData.append with a Blob needs an explicit filename
  form.append(
    'image',
    imageFile instanceof File ? imageFile : new File([imageFile], filename, { type: imageFile.type }),
  );
  form.append('goal', goal);

  const res = await authedFetch('/analyses', {
    method: 'POST',
    // Do NOT set Content-Type — browser sets it with the correct multipart boundary
    body: form,
  });

  if (!res.ok) {
    throw await parseError(res);
  }

  return (await res.json()) as Analysis;
}

/**
 * POST /analyses/:id/follow-up
 */
export async function sendFollowUp(
  analysisId: string,
  question: string,
): Promise<FollowUpAnswer> {
  const res = await authedFetch(`/analyses/${analysisId}/follow-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw await parseError(res);
  }

  return (await res.json()) as FollowUpAnswer;
}
