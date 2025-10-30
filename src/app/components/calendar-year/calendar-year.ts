import { Component, OnInit, effect, signal } from '@angular/core';
import { UserInputService } from '../../services/user-input-service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CalendarMonth } from "../calendar-month/calendar-month";
import { CalendarService, SelectedDates } from '../../services/calendar-service';
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
			this.selectedDates = this.calendarService.getSelectedDatesForYear();
			const vacationData = this.userInput.vacationNumberSignal();
			this.isLoading.set(true);
			// Simulate server-side calculation with a small delay
			setTimeout(() => {
				if (this.selectedDates) {
					this.selectedDates.optimizeVacations(vacationData);
				}
				this.isLoading.set(false);
			}, 1);
		});
	}

	protected selectedDates: SelectedDates = new SelectedDates();

	getYear(monthIndex: number): number {
		const offset = new Date().getMonth() <= monthIndex ? 0 : 1;
		return new Date().getFullYear() + offset;
	}

	// months starting from actual date
	protected months: number[] = Array.from({ length: 12 }, (_, i) => (new Date().getMonth() + i) % 12);

	ngOnInit(): void {
		this.selectedDates = this.calendarService.getSelectedDatesForYear();
	}
}
