import { Component, OnInit, effect, signal } from '@angular/core';
import { UserInputService } from '../../services/user-input-service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CalendarMonth } from "../calendar-month/calendar-month";
import { CalendarService, SelectedDates, VacationsNumber } from '../../services/calendar-service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-calendar-year',
	imports: [MatCard, CalendarMonth, MatCardContent, CommonModule],
	templateUrl: './calendar-year.html',
	styleUrl: './calendar-year.scss',
})
export class CalendarYear implements OnInit {
	protected isLoading = signal(true);

	constructor(private userInput: UserInputService, private calendarService: CalendarService) {
		effect(() => {
			this.selectedDates = this.calendarService.getSelectedDatesForYear(this.year);
			const vacationData = this.userInput.vacationNumberSignal();
			this.isLoading.set(true);
			// Simulate server-side calculation with a small delay
			setTimeout(() => {
				if (this.selectedDates) {
					this.selectedDates.optimizeVacations(vacationData);
				}
				this.isLoading.set(false);
			}, 500);
		});
	}

	protected selectedDates: SelectedDates = new SelectedDates();

	protected year: number = 2026;

	ngOnInit(): void {
		this.selectedDates = this.calendarService.getSelectedDatesForYear(this.year);
		this.isLoading.set(false);
	}
}
