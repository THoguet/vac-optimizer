import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInputService } from '../../services/user-input-service';
import { VacationsNumber } from '../../services/calendar-service';
import { debounceTime, takeUntil, Subject } from 'rxjs';

@Component({
	selector: 'app-user-input',
	imports: [MatFormField, MatLabel, MatInputModule, ReactiveFormsModule],
	templateUrl: './user-input.html',
	styleUrl: './user-input.scss',
})
export class UserInput implements OnInit, OnDestroy {
	constructor(private userInputService: UserInputService) {
		// Watch for signal changes and update form
		effect(() => {
			const vacationData = this.userInputService.vacationNumberSignal();
			this.userInputForm.patchValue({
				CP: vacationData.cp,
				RTT: vacationData.rtt,
				Others: vacationData.other,
			}, { emitEvent: false });
		});
	}

	private destroy$ = new Subject<void>();

	userInputForm: FormGroup = new FormGroup({
		CP: new FormControl<number | null>(null),
		RTT: new FormControl<number | null>(null),
		Others: new FormControl<number | null>(null),
	});

	ngOnInit() {
		this.userInputForm.valueChanges
			.pipe(
				debounceTime(1500),
				takeUntil(this.destroy$)
			)
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
			this.userInputService.setVacationNumber(vacationData);
		}
	}
}
