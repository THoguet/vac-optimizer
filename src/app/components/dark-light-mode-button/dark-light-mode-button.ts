import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme-service';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-dark-light-mode-button',
	imports: [MatIcon],
	templateUrl: './dark-light-mode-button.html',
	styleUrl: './dark-light-mode-button.scss',
})
export class DarkLightModeButton {
	constructor(private themeService: ThemeService) {}

	lightMode(): boolean {
		return this.themeService.isLightMode();
	}

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}
}
