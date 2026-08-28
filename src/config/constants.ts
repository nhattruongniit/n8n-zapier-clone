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
