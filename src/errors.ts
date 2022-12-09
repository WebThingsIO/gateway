export class HttpErrorWithCode extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}

// Problem Details (https://www.rfc-editor.org/rfc/rfc7807)
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}
