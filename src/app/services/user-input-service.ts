import { Injectable, signal } from '@angular/core';
import { SelectableDayType, VacDay } from './calendar-service';

@Injectable({
	providedIn: 'root',
})
export class UserInputService {
	private getRandomNumber(): number {
		return Math.floor(Math.random() * 9) + 1;
	}

	private getInitialValues(): VacDay[] {
		return [
			{
				id: crypto.randomUUID(),
				type: SelectableDayType.CP,
				numberOfDays: this.getRandomNumber(),
				// today + 365 days
				expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			},
			{
				id: crypto.randomUUID(),
				type: SelectableDayType.RTT,
				numberOfDays: this.getRandomNumber(),
				expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			},
			{
				id: crypto.randomUUID(),
				type: SelectableDayType.OTHER,
				numberOfDays: this.getRandomNumber(),
				expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			},
		];
	}

	public createVacationDay(): VacDay {
		return {
			id: crypto.randomUUID(),
			type: SelectableDayType.CP,
			numberOfDays: 1,
			expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		};
	}

	readonly vacationNumberSignal = signal<VacDay[]>(this.getInitialValues());
	readonly remainingVacationDaysSignal = signal<VacDay[]>([]);
	readonly computeTriggerSignal = signal(0);

	public requestComputation(): void {
		this.computeTriggerSignal.update((count) => count + 1);
	}
}
