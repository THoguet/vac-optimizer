import { Component, Input, OnInit, inject } from '@angular/core';
import { CalendarService, Month, monthNames, SelectedDates } from '../../services/calendar-service';
import { MatTooltip } from '@angular/material/tooltip';
import { CalendarSettingsService } from '../../services/calendar-settings-service';
import { DateCacheService } from '../../services/date-cache.service';

@Component({
	selector: 'app-calendar-month',
	imports: [MatTooltip],
	templateUrl: './calendar-month.html',
	styleUrl: './calendar-month.scss',
})
export class CalendarMonth implements OnInit {
	protected calendarSettingsService = inject(CalendarSettingsService);
	private dateCache = inject(DateCacheService);

	@Input({ required: true })
	monthIndex!: number;

	@Input({ required: true })
	year!: number;

	// Use DateCacheService instead of creating Date objects
	getNow(): Date {
		return this.dateCache.getNow();
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
