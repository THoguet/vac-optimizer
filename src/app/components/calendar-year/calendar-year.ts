import { Component, OnInit } from '@angular/core';
import { UserInputService } from '../../services/user-input-service';
import { DateRange } from '@angular/material/datepicker';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CalendarMonth } from "../calendar-month/calendar-month";
import { CalendarService, SelectedDates, VacationsNumber } from '../../services/calendar-service';

@Component({
	selector: 'app-calendar-year',
	imports: [MatCard, CalendarMonth, MatCardContent],
	templateUrl: './calendar-year.html',
	styleUrl: './calendar-year.scss',
})
export class CalendarYear implements OnInit {
	constructor(private userInput: UserInputService, private calendarService: CalendarService) {
	}

	protected selectedDates: SelectedDates = new SelectedDates();

	protected year: number = 2026;

	ngOnInit(): void {
		this.selectedDates = this.calendarService.getSelectedDatesForYear(this.year);
		const vacationsNumber: VacationsNumber = {
			cp: 10, rtt: 5, other: 0
		};
		this.selectedDates.optimizeVacations(vacationsNumber);
	}
}
