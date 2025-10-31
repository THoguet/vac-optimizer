import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private lightModeMedia = window.matchMedia('(prefers-color-scheme: light)');
	isLightMode = signal(this.lightModeMedia.matches);

	constructor() {
		this.toggleTheme(this.isLightMode());
		this.lightModeMedia.addEventListener('change', (e) => {
			this.isLightMode.set(e.matches);
		});
	}

	toggleTheme(forceLight?: boolean) {
		const isLight = forceLight ?? !this.isLightMode();
		this.isLightMode.set(isLight);
		document.body.classList.toggle('light-mode', isLight);
		document.body.classList.toggle('dark-mode', !isLight);
	}
}
