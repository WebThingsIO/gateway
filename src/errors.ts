export class HttpErrorWithCode extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}
