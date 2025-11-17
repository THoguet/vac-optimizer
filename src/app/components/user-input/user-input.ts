import { Component, OnInit, OnDestroy, effect, computed } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserInputService } from '../../services/user-input-service';
import { VacationsNumber } from '../../services/calendar-service';
import { debounceTime, takeUntil, Subject } from 'rxjs';
import { CalendarSettings } from '../calendar-settings/calendar-settings';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-user-input',
	imports: [
		MatFormField,
		MatLabel,
		MatInputModule,
		ReactiveFormsModule,
		CalendarSettings,
		MatCard,
		MatCardContent,
		MatIcon,
	],
	templateUrl: './user-input.html',
	styleUrl: './user-input.scss',
})
export class UserInput implements OnInit, OnDestroy {
	constructor(private userInputService: UserInputService) {
		// Watch for signal changes and update form
		effect(() => {
			const vacationData = this.userInputService.vacationNumberSignal();
			this.userInputForm.patchValue(
				{
					CP: vacationData.cp,
					RTT: vacationData.rtt,
					Others: vacationData.other,
				},
				{ emitEvent: false },
			);
		});
	}

	private destroy$ = new Subject<void>();

	userInputForm: FormGroup = new FormGroup({
		CP: new FormControl<number | null>(null),
		RTT: new FormControl<number | null>(null),
		Others: new FormControl<number | null>(null),
	});

	protected remainingDays = computed(() => {
		const remaining = this.userInputService.remainingVacationDaysSignal();
		return remaining.cp + remaining.rtt + remaining.other;
	});

	protected hasRemainingDays = computed(() => this.remainingDays() > 0);

	ngOnInit() {
		this.userInputForm.valueChanges
			.pipe(debounceTime(1500), takeUntil(this.destroy$))
			.subscribe(() => this.submitForm());
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private submitForm() {
		if (this.userInputForm.valid) {
			const vacationData: VacationsNumber = {
				cp: this.userInputForm.get('CP')?.value || 0,
				rtt: this.userInputForm.get('RTT')?.value || 0,
				other: this.userInputForm.get('Others')?.value || 0,
			};
			this.userInputService.vacationNumberSignal.set(vacationData);
		}
	}
}
