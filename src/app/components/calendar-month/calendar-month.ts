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

	currentMonth: Date = new Date();

	weeksInAMonth: Month = [];


	@Input({ required: true })
	selectedDates!: SelectedDates;

	getMonthName(): string {
		return monthNames[this.monthIndex];
	}

	constructor(private calendarService: CalendarService) { }

	ngOnInit(): void {
		this.weeksInAMonth = this.calendarService.weeksInMonth(this.monthIndex, this.year);
	}
}
