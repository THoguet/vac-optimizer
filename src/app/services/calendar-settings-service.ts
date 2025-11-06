import { Injectable } from '@angular/core';
import { storedSignal } from '../shared/utils/stored-signal.';

@Injectable({
	providedIn: 'root',
})
export class CalendarSettingsService {
	readonly showWeekNumbers = storedSignal('calendarSettings.showWeekNumbers', false);
	readonly samediMalin = storedSignal('calendarSettings.samediMalin', true);
}
