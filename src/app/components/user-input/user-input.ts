import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { UserInputService } from '../../services/user-input-service';
import { CalendarSettings } from '../calendar-settings/calendar-settings';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DayInput } from '../userInput/day-input/day-input';
import { MatButtonModule } from '@angular/material/button';
import { tooltipTypeMapping, DayType, VacDay } from '../../services/calendar-service';

@Component({
	selector: 'app-user-input',
	imports: [
		MatInputModule,
		CalendarSettings,
		MatCard,
		MatCardContent,
		MatIcon,
		MatButtonModule,
		DayInput,
	],
	templateUrl: './user-input.html',
	styleUrl: './user-input.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInput {
	private userInputService: UserInputService = inject(UserInputService);

	protected remainingDays = computed(() => {
		const remaining = this.userInputService.remainingVacationDaysSignal();
		return remaining.reduce((acc, day) => acc + day.numberOfDays, 0);
	});

	protected remainingDaysDetails = computed(() => {
		const remaining = this.userInputService.remainingVacationDaysSignal();
		return remaining
			.filter((day) => day.numberOfDays > 0)
			.map((day) => {
				const typeName = tooltipTypeMapping[day.type as unknown as DayType];
				const expiryDate = day.expiryDate.toLocaleDateString('fr-FR', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				});
				return `${day.numberOfDays} ${typeName} (exp. ${expiryDate})`;
			});
	});

	protected hasRemainingDays = computed(() => this.remainingDays() > 0);

	protected get daysOff() {
		return this.userInputService.vacationNumberSignal();
	}

	public addDay() {
		this.userInputService.vacationNumberSignal.update((days) => [
			...days,
			this.userInputService.createVacationDay(),
		]);
	}

	public removeFromList(index: number) {
		this.userInputService.vacationNumberSignal.update((days) =>
			days.filter((_, i) => i !== index),
		);
	}

	public updateDay(index: number, updatedDay: VacDay) {
		this.userInputService.vacationNumberSignal.update((days) =>
			days.map((day, i) => (i === index ? updatedDay : day)),
		);
	}

	public triggerComputation() {
		// Trigger signal update by setting a new array reference
		this.userInputService.vacationNumberSignal.update((days) => [...days]);
	}
}
