import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { VacationsNumber } from './calendar-service';



@Injectable({
	providedIn: 'root'
})
export class UserInputService {

	private getRandomNumber(): number {
		return Math.floor(Math.random() * 9) + 1;
	}

	private getInitialValues(): VacationsNumber {
		return {
			cp: this.getRandomNumber(),
			rtt: this.getRandomNumber(),
			other: this.getRandomNumber()
		};
	}

	vacationNumberSignal = signal<VacationsNumber>(this.getInitialValues());

	get vacationNumber() {
		return this.vacationNumberSignal();
	}

	setVacationNumber(vacationsNumber: VacationsNumber) {
		this.vacationNumberSignal.set(vacationsNumber);
	}
}
