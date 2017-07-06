/**
 * Best effort declaration files.
 */
declare namespace ANSN1 {

  type EncoderInputTypes = string | number | boolean | number[] | string[] | Buffer;

  type EncoderInput = {
    [id: string]: EncoderInputTypes | EncoderInput;
  };

  type PemParams = {
    label: string;
  }

  class Builder {
    seq(): this;
    obj(...keys: this[]): this;
    key(name: string): this;
    int(): this;
    octstr(): this;
    explicit(n: number): this;
    bitstr(): this;
    optional(): this;
    objid(): this;
  }

  class Encoder {
    encode(input: EncoderInput, type: 'pem', params: PemParams): string;
  }

  export function define(
    subject: string,
    fn: (this: Builder) => void,
  ): Encoder;
}

declare module 'asn1.js' {
  export = ANSN1;
}