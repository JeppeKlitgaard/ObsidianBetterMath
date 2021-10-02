import { BetterMathError } from "Error";
import { App, normalizePath, TFolder, TFile, TAbstractFile, Vault } from "obsidian";

export function resolveTFolder(app: App, folderStr: string): TFolder {
    folderStr  = normalizePath(folderStr);

    const folder = app.vault.getAbstractFileByPath(folderStr);
    if (!folder) {
        throw new BetterMathError(`Folder "${folderStr}" doesn't exist`);
    }
    if (!(folder instanceof TFolder)) {
        throw new BetterMathError(`${folderStr} is a file, not a folder`);
    }

    return folder;
}

export function resolveTFile(app: App, fileStr: string): TFile {
    fileStr = normalizePath(fileStr);

    const file = app.vault.getAbstractFileByPath(fileStr);
    if (!file) {
        throw new BetterMathError(`File "${fileStr}" doesn't exist`);
    }
    if (!(file instanceof TFile)) {
        throw new BetterMathError(`${fileStr} is a folder, not a file`);
    }

    return file;
}

export function getTFilesFromFolder(app: App, folderStr: string): Array<TFile> {
    const folder = resolveTFolder(app, folderStr);

    let files: Array<TFile> = [];
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
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
};
