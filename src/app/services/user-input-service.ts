import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Holidays, { HolidaysTypes } from 'date-holidays';
import { VacationsNumber } from './calendar-service';



@Injectable({
	providedIn: 'root'
})
export class UserInputService {
	private platformId = inject(PLATFORM_ID);

	private getRandomNumber(): number {
		return Math.floor(Math.random() * 9) + 1;
	}

	private getInitialValues(): VacationsNumber {
		if (isPlatformBrowser(this.platformId)) {
			return {
				cp: this.getRandomNumber(),
				rtt: this.getRandomNumber(),
				other: this.getRandomNumber()
			};
		}
		return {
			cp: 0,
			rtt: 0,
			other: 0
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
