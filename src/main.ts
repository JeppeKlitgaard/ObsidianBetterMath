import { readPreamble } from "bettermath/Preamble";
import {
  BetterMathSettings,
  BetterMathSettingsTab,
  DEFAULT_SETTINGS,
} from "bettermath/Settings";
import { loadMathJax, Notice, Plugin } from "obsidian";

export default class BetterMathPlugin extends Plugin {
  settings: BetterMathSettings;

  async onload() {
    console.log(`Loading ${this.manifest.name}`);

    await this.loadSettings();

    this.addSettingTab(new BetterMathSettingsTab(this.app, this));

    await this.setupPreambleInjection();
  }

  async readPreambles(): Promise<string> {
    let content = "";

    const promises: Array<Promise<string>> = [];

    this.settings.preambles.forEach((preamble, index) => {
      if (preamble.enabled) {
        promises.push(readPreamble(this.app, preamble));
      }
    });

    await Promise.all(promises).then((promise) => {
      promise.forEach((fragment) => {
        content += fragment;
      });
    });

    return content;
  }

  async setupPreambleInjection(): Promise<void> {
    // Load MathJax
    await loadMathJax();

    if (!MathJax) {
      new Notice("BetterMath: Failed to load MathJax!");
      console.error("BetterMath: Failed to load MathJax!");

      return;
    }

    const combinedPreambles = await this.readPreambles();

    // @ts-ignore
    if (MathJax.tex2chtml === undefined) {
      // @ts-ignore
      MathJax.startup.ready = () => {
        // @ts-ignore
        MathJax.startup.ready = () => {
          // @ts-ignore
          MathJax.startup.defaultReady();
          // @ts-ignore
          MathJax.tex2chtml(combinedPreambles);
        };
      };
    } else {
      // @ts-ignore
      MathJax.tex2chtml(combinedPreambles);
    }
  }

  onunload() {
    // NOTE: Does not unload preambles. Restart required.
    console.log(`Unloading ${this.manifest.name}`);

    new Notice(
      "BetterMath was unloaded, but a restart of Obsidian is required for this to take full effect."
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
