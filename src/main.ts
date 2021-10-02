import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, loadMathJax} from 'obsidian';
import { readPreamble } from 'Preamble';
import { BetterMathSettings, BetterMathSettingsTab, DEFAULT_SETTINGS } from 'Settings'

export default class BetterMathPlugin extends Plugin {
	settings: BetterMathSettings;

	async onload() {
		console.log(`Loading ${this.manifest.name}`);

		await this.loadSettings();

		this.addSettingTab(new BetterMathSettingsTab(this.app, this));

		await this.setupPreambleInjection();
	}

	async readPreambles(): Promise<string> {
		var content = "";

		let promises: Array<Promise<string>> = []

		this.settings.preambles.forEach((preamble, index) => {
			if (preamble.enabled) {
				promises.push(readPreamble(this.app, preamble))
			}
		})

		await Promise.all(promises).then((promise => {
			promise.forEach(fragment => {
				content += fragment
			})
		}));

		return content;
	}

	async setupPreambleInjection(): Promise<void> {
		let preambleLoaded = false;

		await loadMathJax();

		this.registerMarkdownPostProcessor(async (el, ctx) => {
			if (typeof MathJax != 'undefined' && !preambleLoaded) {
				let preamble = await this.readPreambles();


				// this.readPreambles().then((c) => {
				preambleLoaded = true;

					// Check if MathJax has already loaded and render the preamble
					// @ts-ignore
					if (MathJax.tex2chtml == undefined) {
						// @ts-ignore
						MathJax.startup.ready = () => {
							// @ts-ignore
							MathJax.startup.defaultReady();
							// @ts-ignore
							MathJax.tex2chtml(preamble);
						}
					} else {
						// @ts-ignore
						MathJax.tex2chtml(preamble);
					}


					// Refresh the active view to re-render its math content
					let activeLeaf = this.app.workspace.activeLeaf;

					// TODO: use something in stable API to do this
					// @ts-ignore
					let preview = activeLeaf.view.previewMode;
					preview.set(preview.get(), true)
				};
			}
		)
	}


	onunload() {
		console.log(`Unloading ${this.manifest.name}`);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
