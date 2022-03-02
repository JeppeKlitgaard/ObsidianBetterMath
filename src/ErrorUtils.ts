import { BetterMathError } from "bettermath/Error";
import { logError } from "bettermath/Log";

export async function errorWrapper<T>(
  fn: () => Promise<T>,
  msg: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    if (!(e instanceof BetterMathError)) {
      logError(new BetterMathError(msg, e.message));
    } else {
      logError(e);
    }
    return null;
  }
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T | null {
  try {
    return fn();
  } catch (e) {
    logError(new BetterMathError(msg, e.message));
    return null;
  }
}
