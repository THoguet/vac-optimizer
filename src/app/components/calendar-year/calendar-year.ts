import { Component, effect, signal, inject, untracked } from '@angular/core';
import { UserInputService } from '../../services/user-input-service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CalendarMonth } from '../calendar-month/calendar-month';
import { CalendarService, SelectedDates } from '../../services/calendar-service';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CalendarSettingsService } from '../../services/calendar-settings-service';
import { DateCacheService } from '../../services/date-cache.service';

@Component({
	selector: 'app-calendar-year',
	imports: [MatCard, CalendarMonth, MatCardContent, MatProgressSpinner],
	templateUrl: './calendar-year.html',
	styleUrl: './calendar-year.scss',
})
export class CalendarYear {
	private dateCache = inject(DateCacheService);
	private userInput = inject(UserInputService);
	private calendarService = inject(CalendarService);
	private calendarSettingsService = inject(CalendarSettingsService);

	protected isLoading = signal(true);
	protected loadingProgress = signal(0);

	// Use DateCacheService instead of creating Date objects
	private get currentMonth() {
		return this.dateCache.getCurrentMonth();
	}

	private get currentYear() {
		return this.dateCache.getCurrentYear();
	}

	constructor() {
		effect(() => {
			this.userInput.computeTriggerSignal();

			this.selectedDates = this.calendarService.getSelectedDatesForYear();
			const vacationData = untracked(() => this.userInput.vacationNumberSignal());
			const c = untracked(() => this.calendarSettingsService.get('samediMalin')());
			console.log('Samedi Malin setting:', c);
			console.log('Optimizing vacations with data:', vacationData);
			this.isLoading.set(true);
			this.loadingProgress.set(0);
			// Defer execution to allow UI to update
			queueMicrotask(() => {
				void (async () => {
					if (this.selectedDates) {
						// Create a deep copy to avoid mutating the original signal data
						const vacationDaysCopy = vacationData.map((vd) => ({ ...vd }));
						const remainingDays = await this.selectedDates.optimizeVacations(
							vacationDaysCopy,
							this.calendarSettingsService,
							this.calendarService,
							(progress: number) => {
								this.loadingProgress.set(progress);
							},
						);
						// Update the remaining vacation days signal
						this.userInput.remainingVacationDaysSignal.set(remainingDays);
					}
					this.isLoading.set(false);
				})();
			});
		});
	}

	protected selectedDates: SelectedDates = new SelectedDates();

	getYear(monthIndex: number): number {
		const offset = this.currentMonth <= monthIndex ? 0 : 1;
		return this.currentYear + offset;
	}

	// months starting from actual date - cache this array
	protected months: number[] = Array.from({ length: 12 }, (_, i) => (this.currentMonth + i) % 12);
}
