import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CalendarSettingsService {
	readonly showWeekNumbers = signal(false);
	readonly samediMalin = signal(true);

	readonly settings = [
		{
			signal: this.showWeekNumbers,
			id: 'showWeekNumbers',
			description: 'Afficher les numéros de semaine',
		},
		{
			signal: this.samediMalin,
			id: 'samediMalin',
			description: 'Activer le Samedi Malin',
		},
	];
}
