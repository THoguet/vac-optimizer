import { Component, effect, signal, inject } from '@angular/core';
import { UserInputService } from '../../services/user-input-service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CalendarMonth } from '../calendar-month/calendar-month';
import { CalendarService, SelectedDates } from '../../services/calendar-service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CalendarSettingsService } from '../../services/calendar-settings-service';
import { DateCacheService } from '../../services/date-cache.service';

@Component({
	selector: 'app-calendar-year',
	imports: [MatCard, CalendarMonth, MatCardContent, CommonModule, MatProgressSpinner],
	templateUrl: './calendar-year.html',
	styleUrl: './calendar-year.scss',
})
export class CalendarYear {
	private dateCache = inject(DateCacheService);
	private userInput = inject(UserInputService);
	private calendarService = inject(CalendarService);
	private calendarSettingsService = inject(CalendarSettingsService);

	protected isLoading = signal(true);

	// Use DateCacheService instead of creating Date objects
	private get currentMonth() {
		return this.dateCache.getCurrentMonth();
	}

	private get currentYear() {
		return this.dateCache.getCurrentYear();
	}

	constructor() {
		effect(() => {
			this.selectedDates = this.calendarService.getSelectedDatesForYear();
			const vacationData = this.userInput.vacationNumberSignal();
			const c = this.calendarSettingsService.samediMalin();
			console.log('Samedi Malin setting:', c);
			console.log('Optimizing vacations with data:', vacationData);
			this.isLoading.set(true);
			// Simulate server-side calculation with a small delay
			setTimeout(() => {
				if (this.selectedDates) {
					// Create a copy to avoid mutating the original signal data
					this.selectedDates.optimizeVacations(
						{ ...vacationData },
						this.calendarSettingsService,
						this.calendarService,
					);
				}
				this.isLoading.set(false);
			}, 1);
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
