import BetterMathPlugin from "bettermath/main";
import { Preamble } from "bettermath/Preamble";
import { FileSuggest } from "bettermath/suggesters/FileSuggester";
import { FolderSuggest } from "bettermath/suggesters/FolderSuggester";
import { arraymove, resolveTFolder } from "bettermath/Utils";
import { App, ButtonComponent, PluginSettingTab, Setting } from "obsidian";

export interface BetterMathSettings {
  preambleFolder: string;
  preambles: Array<Preamble>;
}

export const DEFAULT_SETTINGS: BetterMathSettings = {
  preambleFolder: "",
  preambles: [],
};

export class BetterMathSettingsTab extends PluginSettingTab {
  plugin: BetterMathPlugin;

  constructor(app: App, plugin: BetterMathPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Better Math Settings" });

    containerEl.createEl("h3", { text: "General Settings" });
    this.displayPreambleFolder();

    this.displayPreambleToggles();
  }

  displayPreambleFolder(): void {
    new Setting(this.containerEl)
      .setName("Preamble Folder")
      .setDesc("The folder where preambles are located")
      .addSearch((cb) => {
        new FolderSuggest(this.app, cb.inputEl);
        cb.setPlaceholder("Folder")
          .setValue(this.plugin.settings.preambleFolder)
          .onChange(async (newFolder) => {
            this.plugin.settings.preambleFolder = newFolder;
            await this.plugin.saveSettings();
            this.display();
          });
      });
  }

  displayPreambleToggles(): void {
    this.containerEl.createEl("h3", { text: "Preambles" });

    // Add new
    new Setting(this.containerEl)
      .setName("Add New")
      .setDesc("Add new preamble")
      .addButton((button: ButtonComponent): ButtonComponent => {
        const b = button
          .setTooltip("Add additional preamble")
          .setButtonText("+")
          .setCta()
          .onClick(() => {
            this.plugin.settings.preambles.push({ enabled: true, path: "" });
            this.display();
          });

        return b;
      });

    this.plugin.settings.preambles.forEach((preamble, index) => {
      const s = new Setting(this.containerEl)
        .setName("Preamble")
        .addSearch((cb) => {
          const preambleTFolder = resolveTFolder(
            this.app,
            this.plugin.settings.preambleFolder
          );

          new FileSuggest(this.app, cb.inputEl, this.plugin, preambleTFolder, [
            "sty",
          ]);
          cb.setPlaceholder("Preamble file")
            .setValue(preamble.path)
            .onChange(async (newPath) => {
              this.plugin.settings.preambles[index].path = newPath;
              await this.plugin.saveSettings();
            });
        })
        .addToggle((toggle) => {
          toggle.setValue(preamble.enabled).onChange(async (v) => {
            preamble.enabled = v;
            await this.plugin.saveSettings();
          });
        })
        .addExtraButton((cb) => {
          cb.setIcon("up-chevron-glyph")
            .setTooltip("Move up")
            .onClick(async () => {
              arraymove(this.plugin.settings.preambles, index, index - 1);
              await this.plugin.saveSettings();
              this.display();
            });
        })
        .addExtraButton((cb) => {
          cb.setIcon("down-chevron-glyph")
            .setTooltip("Move down")
            .onClick(async () => {
              arraymove(this.plugin.settings.preambles, index, index + 1);
              await this.plugin.saveSettings();
              this.display();
            });
        })
        .addExtraButton((cb) => {
          cb.setIcon("cross")
            .setTooltip("Delete")
            .onClick(async () => {
              this.plugin.settings.preambles.splice(index, 1);
              await this.plugin.saveSettings();
              this.display();
            });
        });
    });
  }
}
