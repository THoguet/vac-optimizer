import { Component, Input, OnInit } from '@angular/core';
import { CalendarService, Month, monthNames, SelectedDates } from '../../services/calendar-service';
import { MatTooltip } from '@angular/material/tooltip';
import { CalendarSettingsService } from '../../services/calendar-settings-service';

@Component({
	selector: 'app-calendar-month',
	imports: [MatTooltip],
	templateUrl: './calendar-month.html',
	styleUrl: './calendar-month.scss',
})
export class CalendarMonth implements OnInit {
	constructor(protected calendarSettingsService: CalendarSettingsService) {}

	@Input({ required: true })
	monthIndex!: number;

	@Input({ required: true })
	year!: number;

	// Cache "now" as a class property to avoid recreating it on every call
	// Note: This value is cached at component initialization and won't update if the day changes
	// while the component is still mounted. This is acceptable for this use case since the app
	// is primarily used within a single day session.
	private readonly now: Date = (() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	})();

	getNow(): Date {
		return this.now;
	}

	currentMonth: Date = new Date();

	weeksInAMonth: Month = [];

	@Input({ required: true })
	selectedDates!: SelectedDates;

	getMonthName(): string {
		return monthNames[this.monthIndex];
	}

	getWeekNumber(week: (Date | null)[]): number | null {
		for (const day of week) {
			if (day) {
				return CalendarService.getWeekNumber(day);
			}
		}
		return null;
	}

	ngOnInit(): void {
		this.weeksInAMonth = CalendarService.weeksInMonth(this.monthIndex, this.year);
	}
}
