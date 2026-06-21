export interface ErrorEnvelope {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export function errorEnvelope(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): ErrorEnvelope {
  if (details !== undefined) {
    return { code, message, details };
  }
  return { code, message };
}
