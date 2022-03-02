import { BetterMathError } from "bettermath/Error";
import {
  App,
  normalizePath,
  TAbstractFile,
  TFile,
  TFolder,
  Vault,
} from "obsidian";

export function resolveTFolder(app: App, folderStr: string): TFolder {
  folderStr = normalizePath(folderStr);

  const folder = app.vault.getAbstractFileByPath(folderStr);
  if (!folder) {
    throw new BetterMathError(`Folder "${folderStr}" doesn't exist`);
  }
  if (!(folder instanceof TFolder)) {
    throw new BetterMathError(`${folderStr} is a file, not a folder`);
  }

  return folder;
}

export async function checkFileStr(app: App, fileStr: string): Promise<void> {
  fileStr = normalizePath(fileStr);
  const fileStat = await app.vault.adapter.stat(fileStr);

  if (!fileStat) {
    throw new BetterMathError(`File "${fileStr}" doesn't exist`);
  }

  if (fileStat.type === "folder") {
    throw new BetterMathError(`${fileStr} is a folder, not a file`);
  }
}

export function getTFilesFromFolder(app: App, folderStr: string): Array<TFile> {
  const folder = resolveTFolder(app, folderStr);

  const files: Array<TFile> = [];
  Vault.recurseChildren(folder, (file: TAbstractFile) => {
    if (file instanceof TFile) {
      files.push(file);
    }
  });

  files.sort((a, b) => {
    return a.basename.localeCompare(b.basename);
  });

  return files;
}

export function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
