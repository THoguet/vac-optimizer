import { storedSignal } from '../shared/utils/stored-signal.';
import { Injectable, WritableSignal } from '@angular/core';

interface SettingDefinition {
	defaultValue: boolean;
	description: string;
}

@Injectable({
	providedIn: 'root',
})
export class CalendarSettingsService {
	private readonly definitions = new Map<string, SettingDefinition>([
		[
			'showWeekNumbers',
			{
				defaultValue: false,
				description: 'Afficher les numéros de semaine',
			},
		],
		[
			'samediMalin',
			{
				defaultValue: true,
				description: 'Activer le Samedi Malin',
			},
		],
	]);

	private readonly signals = new Map<string, WritableSignal<boolean>>();

	constructor() {
		for (const [id, def] of this.definitions) {
			const storageKey = `calendarSettings.${id}`;
			this.signals.set(id, storedSignal(storageKey, def.defaultValue));
		}
	}

	get(id: string): WritableSignal<boolean> {
		const signal = this.signals.get(id);
		if (signal) {
			return signal;
		}
		// Return a default signal if the ID is invalid
		return storedSignal(`calendarSettings.${id}`, false);
	}

	get settingsArray() {
		return Array.from(this.definitions.entries()).map(([id, def]) => ({
			id,
			signal: this.signals.get(id)!,
			description: def.description,
		}));
	}

	getDescription(id: string): string {
		return this.definitions.get(id)?.description ?? '';
	}
}
