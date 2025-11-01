import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CalendarSettingsService {
	readonly showWeekNumbers = signal(false);
	readonly samediMalin = signal(true);
}
