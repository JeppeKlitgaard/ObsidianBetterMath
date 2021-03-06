// Credit: SilentVoid13's Templater

// Fix: captureStackTrace not defined on ErrorConstructor

export class BetterMathError extends Error {
  constructor(msg: string, public console_msg?: string) {
    super(msg);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
