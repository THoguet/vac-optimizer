import { Injectable, signal } from '@angular/core';
import Holidays, { HolidaysTypes } from 'date-holidays';
import { VacationsNumber } from './calendar-service';



@Injectable({
	providedIn: 'root'
})
export class UserInputService {
	private getRandomNumber(): number {
		return Math.floor(Math.random() * 9) + 1;
	}

	vacationNumberSignal = signal<VacationsNumber>({
		cp: this.getRandomNumber(),
		rtt: this.getRandomNumber(),
		other: this.getRandomNumber()
	});

	get vacationNumber() {
		return this.vacationNumberSignal();
	}

	setVacationNumber(vacationsNumber: VacationsNumber) {
		this.vacationNumberSignal.set(vacationsNumber);
	}
}
