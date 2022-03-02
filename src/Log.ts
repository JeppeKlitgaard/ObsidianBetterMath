// Credit: SilentVoid13's Templater

import { BetterMathError } from "bettermath/Error";
import { Notice } from "obsidian";

export function logUpdate(msg: string): void {
  const notice = new Notice("", 15000);
  // TODO: Find better way for this
  // @ts-ignore
  notice.noticeEl.innerHTML = `<b>Templater update</b>:<br/>${msg}`;
}

export function logError(e: Error | BetterMathError): void {
  const notice = new Notice("", 8000);

  if (e instanceof BetterMathError && e.console_msg) {
    // TODO: Find a better way for this
    // @ts-ignore
    notice.noticeEl.innerHTML = `<b>Better Math Error</b>:<br/>${e.message}<br/>Check console for more informations`;
    console.error(`Better Math Error:`, e.message, "\n", e.console_msg);
  } else {
    // @ts-ignore
    notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}`;
  }
}
