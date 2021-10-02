import { BetterMathError } from "Error";
import { logError } from "Log";

export async function errorWrapper<T>(fn: () => Promise<T>, msg: string): Promise<T> {
    try {
        return await fn();
    } catch(e) {
        if (!(e instanceof BetterMathError)) {
            logError(new BetterMathError(msg, e.message));
        } else {
            logError(e);
        }
        return null;
    }
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T {
    try {
        return fn();
    } catch(e) {
        logError(new BetterMathError(msg, e.message));
        return null;
    }
}
