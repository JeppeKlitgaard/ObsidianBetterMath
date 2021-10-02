import { App } from "obsidian";
import { resolveTFile } from "Utils";

export interface Preamble {
    enabled: boolean;
    path: string;
}

export async function readPreamble(app: App, preamble: Preamble): Promise<string> {
    const file = resolveTFile(app, preamble.path)
    const content = await app.vault.read(file);

    return content;
}