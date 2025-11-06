import { Injectable, WritableSignal, inject, Injector } from '@angular/core';
import { storedSignal } from '../shared/utils/stored-signal';

interface SettingDefinition {
	defaultValue: boolean;
	description: string;
}

@Injectable({
	providedIn: 'root',
})
export class CalendarSettingsService {
	private readonly injector = inject(Injector);

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

	readonly settingsArray: ReadonlyArray<{
		id: string;
		signal: WritableSignal<boolean>;
		description: string;
	}>;

	constructor() {
		for (const [id, def] of this.definitions) {
			const storageKey = `calendarSettings.${id}`;
			this.signals.set(id, storedSignal(storageKey, def.defaultValue, this.injector));
		}

		this.settingsArray = Array.from(this.definitions.entries()).map(([id, def]) => ({
			id,
			signal: this.signals.get(id)!,
			description: def.description,
		}));
	}

	/**
	 * Returns the signal for the given setting ID.
	 * @throws Error if the setting ID doesn't exist
	 */
	get(id: string): WritableSignal<boolean> {
		const signal = this.signals.get(id);
		if (!signal) {
			throw new Error(`Setting with id "${id}" does not exist`);
		}
		return signal;
	}

	getDescription(id: string): string {
		return this.definitions.get(id)?.description ?? '';
	}
}
