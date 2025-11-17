import { Injectable, signal } from '@angular/core';
import { VacationsNumber } from './calendar-service';

@Injectable({
	providedIn: 'root',
})
export class UserInputService {
	private getRandomNumber(): number {
		return Math.floor(Math.random() * 9) + 1;
	}

	private getInitialValues(): VacationsNumber {
		return {
			cp: this.getRandomNumber(),
			rtt: this.getRandomNumber(),
			other: this.getRandomNumber(),
		};
	}

	readonly vacationNumberSignal = signal<VacationsNumber>(this.getInitialValues());
	readonly remainingVacationDaysSignal = signal<VacationsNumber>({
		cp: 0,
		rtt: 0,
		other: 0,
	});
}
