import { checkFileStr } from "bettermath/Utils";
import { App } from "obsidian";

export interface Preamble {
  enabled: boolean;
  path: string;
}

export async function readPreamble(
  app: App,
  preamble: Preamble
): Promise<string> {
  await checkFileStr(app, preamble.path);
  const content = await app.vault.adapter.read(preamble.path);

  return content;
}
