import { Component, Input, OnInit } from '@angular/core';
import { CalendarService, Month, monthNames, SelectedDates } from '../../services/calendar-service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
	selector: 'app-calendar-month',
	imports: [MatTooltip],
	templateUrl: './calendar-month.html',
	styleUrl: './calendar-month.scss',
})
export class CalendarMonth implements OnInit {

	@Input({ required: true })
	monthIndex!: number;

	@Input({ required: true })
	year!: number;

	getNow(): Date {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return now;
	}

	currentMonth: Date = new Date();

	weeksInAMonth: Month = [];


	@Input({ required: true })
	selectedDates!: SelectedDates;

	getMonthName(): string {
		return monthNames[this.monthIndex];
	}

	ngOnInit(): void {
		this.weeksInAMonth = CalendarService.weeksInMonth(this.monthIndex, this.year);
	}
}
