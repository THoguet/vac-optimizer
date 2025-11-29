import {
	Component,
	OnInit,
	OnDestroy,
	computed,
	inject,
	ChangeDetectionStrategy,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UserInputService } from '../../services/user-input-service';
import { Subject } from 'rxjs';
import { CalendarSettings } from '../calendar-settings/calendar-settings';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DayInput } from '../userInput/day-input/day-input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-user-input',
	imports: [
		MatInputModule,
		ReactiveFormsModule,
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
export class UserInput implements OnInit, OnDestroy {
	private userInputService: UserInputService = inject(UserInputService);
	public daysOff = this.userInputService.vacationNumberSignal();
	private destroy$ = new Subject<void>();

	protected remainingDays = computed(() => {
		const remaining = this.userInputService.remainingVacationDaysSignal();
		return remaining.length;
	});

	protected hasRemainingDays = computed(() => this.remainingDays() > 0);

	ngOnInit() {}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public addDay() {
		this.daysOff.push(this.userInputService.createVacationDay());
	}

	public removeFromList(index: number) {
		this.daysOff.splice(index, 1);
	}
}
