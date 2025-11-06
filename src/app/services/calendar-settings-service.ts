import { Injectable, signal, WritableSignal } from '@angular/core';

interface CalendarSetting {
	signal: WritableSignal<boolean>;
	id: string;
	description: string;
}

@Injectable({
	providedIn: 'root',
})
export class CalendarSettingsService {
	readonly showWeekNumbers = signal(false);
	readonly samediMalin = signal(true);

	readonly settings: readonly CalendarSetting[] = [
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
