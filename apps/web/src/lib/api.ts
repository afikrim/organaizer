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

/** Abort in-flight requests that exceed this budget (analysis can be slow). */
const REQUEST_TIMEOUT_MS = 45_000;

/**
 * fetch() wrapped with an AbortController timeout. Always clears the timer.
 * Aborts surface as a DOMException with name 'AbortError'.
 */
async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Translate transport-level failures (timeout / network) into ApiClientError.
 * Errors already shaped as ApiClientError (thrown after a response is read)
 * are passed through unchanged.
 */
function toClientError(err: unknown): ApiClientError {
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    return err as ApiClientError;
  }
  if (err instanceof DOMException && err.name === 'AbortError') {
    return {
      status: 0,
      code: 'timeout',
      message: 'The request took too long. Please try again.',
    };
  }
  return {
    status: 0,
    code: 'network',
    message: 'Network error. Check your connection and try again.',
  };
}

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
  const res = await fetchWithTimeout(`${BASE_URL}/sessions`, {
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

  const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
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
    return fetchWithTimeout(`${BASE_URL}${path}`, {
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

  let res: Response;
  try {
    res = await authedFetch('/analyses', {
      method: 'POST',
      // Do NOT set Content-Type — browser sets it with the correct multipart boundary
      body: form,
    });
  } catch (err) {
    throw toClientError(err);
  }

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
  let res: Response;
  try {
    res = await authedFetch(`/analyses/${analysisId}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  } catch (err) {
    throw toClientError(err);
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return (await res.json()) as FollowUpAnswer;
}
