import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { SelectableDayType, tooltipTypeMapping, VacDay } from '../../../services/calendar-service';
import { MatCard } from '@angular/material/card';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import {
	MatDatepicker,
	MatDatepickerInput,
	MatDatepickerInputEvent,
	MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	NativeDateAdapter,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

class CustomDateAdapter extends NativeDateAdapter {
	override format(date: Date, displayFormat: unknown): string {
		if (displayFormat === 'input') {
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const year = date.getFullYear();
			return `${day}/${month}/${year}`;
		}
		return super.format(date, displayFormat as object);
	}

	override parse(value: string): Date | null {
		if (!value) return null;
		const parts = value.split('/');
		if (parts.length === 3) {
			const day = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const year = parseInt(parts[2], 10);
			if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
				return new Date(year, month, day);
			}
		}
		return null;
	}
}

const MY_DATE_FORMATS = {
	parse: {
		dateInput: 'input',
	},
	display: {
		dateInput: 'input',
		monthYearLabel: { year: 'numeric', month: 'short' },
		dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
		monthYearA11yLabel: { year: 'numeric', month: 'long' },
	},
};

@Component({
	selector: 'app-day-input',
	imports: [
		MatIconModule,
		MatCard,
		MatSelect,
		MatOption,
		MatInput,
		MatDatepicker,
		MatLabel,
		MatDatepickerToggle,
		MatDatepickerInput,
		MatInputModule,
		MatButtonModule,
	],
	templateUrl: './day-input.html',
	styleUrl: './day-input.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{ provide: DateAdapter, useClass: CustomDateAdapter },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
		{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
	],
})
export class DayInput {
	public day = input.required<VacDay>();
	public dayChange = output<VacDay>();
	public deleteEntry = output<void>();

	protected readonly selectableDayTypes = Object.values(SelectableDayType);
	protected readonly tooltipTypeMapping = tooltipTypeMapping;

	onInput(event: Event) {
		const value = Number((event.target as HTMLInputElement).value);
		this.dayChange.emit({ ...this.day(), numberOfDays: value });
	}

	onTypeChange(type: SelectableDayType) {
		this.dayChange.emit({ ...this.day(), type });
	}

	addEvent(event: MatDatepickerInputEvent<Date>) {
		this.dayChange.emit({ ...this.day(), expiryDate: event.value! });
	}
}
