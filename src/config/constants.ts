export const POLAR_SLUG = 'pro';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
}

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type HttpRequestStatus = "loading" | "success" | "error";

export const HTTP_REQUEST_CHANNEL_NAME = "http-request";

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger";

export const GOOGLE_FORM_TRIGGER_CHANNEL_NAME = "google-form-trigger";

export const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger";

export const GEMINI_CHANNEL_NAME = "gemini-execution";
export const FALLBACK_MODEL_GEMINI = "gemini-3.6-flash";
export const AVAILABLE_MODELS_GEMINI = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro"
];

export const OPENAI_CHANNEL_NAME = "openai-execution";
export const FALLBACK_MODEL_OPENAI = "o4-mini";
export const AVAILABLE_MODELS_OPENAI = [
  "o4-mini"
];

export const ANTHROPIC_CHANNEL_NAME = "anthropic-execution";
export const FALLBACK_MODEL_ANTHROPIC = "claude-sonnet-4-5";
export const AVAILABLE_MODELS_ANTHROPIC = [
  "claude-sonnet-4-5"
];