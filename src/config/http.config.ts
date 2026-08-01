const httpConfig = () => ({
  // Success responses
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
});

export const HTTPSTATUS = httpConfig();

export type HttpStatusCode = (typeof HTTPSTATUS)[keyof typeof HTTPSTATUS];
