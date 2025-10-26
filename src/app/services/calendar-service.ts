import { Injectable } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import Holidays, { HolidaysTypes } from 'date-holidays';

const lang = 'en';

const allTypesOptions: HolidaysTypes.Options = {
	languages: [lang],
};

@Injectable({
	providedIn: 'root'
})
export class CalendarService {

	getSelectedDatesForYear(year: number): SelectedDates {
		const holidays = this.getHolidays(year);
		const monthInAYear = this.monthsInYear(year);
		let selectedDates: SelectedDates = new SelectedDates();
		for (const weeksInAMonth of monthInAYear) {
			for (const daysInAWeek of weeksInAMonth) {
				for (const day of daysInAWeek) {
					if (day) {
						this.setWeekendSelection(day, selectedDates);
						if (holidays.some(holiday => holiday.getTime() === day.getTime())) {
							selectedDates.push(new SelectedDate(dayType.CLOSED_DAY, new DateRange<Date>(day, day)));
						}
						if (day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() && day.getFullYear() === new Date().getFullYear()) {
							selectedDates.push(new SelectedDate(dayType.TODAY, new DateRange<Date>(day, day)));
						}
					}
				}
			}
		}
		selectedDates.computeHeuristics();
		for (const weeksInAMonth of monthInAYear) {
			for (const daysInAWeek of weeksInAMonth) {
				for (const day of daysInAWeek) {
					if (day) {
						if (day.getDay() === 5) {
							// Friday
							selectedDates.push(new SelectedDate(dayType.RTT, new DateRange<Date>(day, day)));
						}
					}
				}
			}
		}
		selectedDates.computeHeuristics();
		return selectedDates;
	}

	setWeekendSelection(date: Date, selectedDates: SelectedDates) {
		if (date.getDay() === 6) {
			selectedDates.push(new SelectedDate(dayType.WEEKEND, new DateRange<Date>(date, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))));
		}
		if (date.getDate() === 1 && date.getDay() === 0) {
			selectedDates.push(new SelectedDate(dayType.WEEKEND, new DateRange<Date>(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1), date)));
		}
	}


	getHolidays(year: number): Date[] {
		// Logic to return holidays for the given year
		const hd = new Holidays('FR', allTypesOptions);
		const holidays = hd.getHolidays(year, lang);
		let holidaysDate: Date[] = holidays.map(holiday => new Date(holiday.date));
		return holidaysDate;
	}

	daysInWeek(weekIndex: number, monthIndex: number, year: number): Week {
		const firstDayOfMonth = new Date(year, monthIndex, 1);
		const firstDayOfWeek = new Date(firstDayOfMonth);
		let offset = firstDayOfMonth.getDay() - 1; // Adjust to make Monday the first day of the week
		if (offset < 0) {
			offset = 6; // Sunday case
		}
		firstDayOfWeek.setDate(firstDayOfMonth.getDate() + weekIndex * 7 - offset);

		const days: Week = [];
		for (let i = 0; i < 7; i++) {
			const currentDay = new Date(firstDayOfWeek);
			currentDay.setDate(firstDayOfWeek.getDate() + i);
			if (currentDay.getMonth() === monthIndex) {
				days.push(currentDay);
			} else {
				days.push(null);
			}
		}
		return days;
	}

	weeksInMonth(monthIndex: number, year: number): Month {
		const weeks: Month = [];
		let weekIndex = 0;
		while (true) {
			const week = this.daysInWeek(weekIndex, monthIndex, year);
			if (week.every(day => day === null)) {
				break;
			}
			weeks.push(week);
			weekIndex++;
		}
		return weeks;
	}


	monthsInYear(year: number): Year {
		const months: Year = [];
		for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
			months.push(this.weeksInMonth(monthIndex, year));
		}
		return months;
	}

	optimizeVacations(vacationsNumber: VacationsNumber, year: number, selectedDates: SelectedDates): void {
		// Logic to optimize vacations

	}
}

export type VacationsNumber = {
	rtt: number;
	cp: number;
	other: number;
};

export type Week = (Date | null)[];
export type Month = Week[];
export type Year = Month[];

export enum dayType {
	WEEKEND = "weekend",
	CLOSED_DAY = "closed-day",
	RTT = "rtt",
	CP = "cp",
	OTHER = "other",
	TODAY = "today",
}

export const tooltipTypeMapping: { [key in dayType]: string } = {
	[dayType.WEEKEND]: "Weekend",
	[dayType.CLOSED_DAY]: "Jour Férié",
	[dayType.RTT]: "RTT",
	[dayType.CP]: "Congé Payé",
	[dayType.OTHER]: "Autre",
	[dayType.TODAY]: "Aujourd'hui",
};

export const monthNames: string[] = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre"
];


export interface SelectedDateInterface {
	isSelected(date: Date): boolean;

	isStart(date: Date): boolean;
	isEnd(date: Date): boolean;

	getClasses(date: Date): string;
}

export class SelectedDate implements SelectedDateInterface {
	type: dayType | null;
	range: DateRange<Date>;

	constructor(type: dayType | null, range: DateRange<Date>) {
		this.type = type;
		this.range = range;
	}

	isSelected(date: Date): boolean {
		return this.range.start !== null && this.range.end !== null && date >= this.range.start && date <= this.range.end;
	}

	isStart(date: Date): boolean {
		return this.range.start !== null && date.getTime() === this.range.start.getTime();
	}

	isEnd(date: Date): boolean {
		return this.range.end !== null && date.getTime() === this.range.end.getTime();
	}

	getClasses(date: Date): string {
		let returnType: dayType | string = "";
		if (this.type && date >= this.range.start! && date <= this.range.end!) {
			returnType = returnType += this.type + " ";
		}
		return returnType;
	}

	getTooltip(date: Date): string | null | undefined {
		if (this.isSelected(date)) {
			if (this.type) {
				return tooltipTypeMapping[this.type];
			}
		}
		return null;
	}

	getLengthInDays(): number {
		if (this.range.start && this.range.end) {
			const timeDiff = this.range.end.getTime() - this.range.start.getTime();
			return Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
		}
		return 0;
	}
}

export class SelectedDates implements SelectedDateInterface {
	_datesSelected: SelectedDate[] = [];
	datesSelected: SelectedDate[] = [];

	push(selectedDate: SelectedDate) {
		this._datesSelected.push(selectedDate);
		this.datesSelected = this._datesSelected.slice();
		this.grouping();
	}

	// make a "mother group" with type = null when two or more groups are adjacent or overlapping; keep the children groups
	grouping() {
		this.datesSelected.sort((a, b) => a.range.start!.getTime() - b.range.start!.getTime());
		let grouped: SelectedDate[] = [];
		let i = 0;
		while (i < this.datesSelected.length) {
			let current = this.datesSelected[i];
			let j = i + 1;
			while (j < this.datesSelected.length) {
				let next = this.datesSelected[j];
				if (current.range.end! >= next.range.start!) {
					// overlapping or adjacent
					current = new SelectedDate(null, new DateRange<Date>(
						current.range.start! < next.range.start! ? current.range.start! : next.range.start!,
						current.range.end! > next.range.end! ? current.range.end! : next.range.end!
					));
					j++;
				} else {
					break;
				}
			}
			grouped.push(current);
			i = j;
		}
		this.datesSelected = grouped;
	}

	isSelected(date: Date): boolean {
		return this.datesSelected.some(selectedDate => selectedDate.isSelected(date));
	}

	private getRangeBoundaryCounts(date: Date): { starts: number; ends: number } {
		let starts = 0;
		let ends = 0;
		for (const selected of this.datesSelected) {
			if (selected.range.start && date.getTime() === selected.range.start.getTime()) {
				starts++;
			}
			if (selected.range.end && date.getTime() === selected.range.end.getTime()) {
				ends++;
			}
		}
		return { starts, ends };
	}

	isStart(date: Date): boolean {
		if (this.existInARangeButNotABoundary(date)) return false;
		const { starts, ends } = this.getRangeBoundaryCounts(date);
		return starts >= ends;
	}

	isEnd(date: Date): boolean {
		if (this.existInARangeButNotABoundary(date)) return false;
		const { starts, ends } = this.getRangeBoundaryCounts(date);
		return ends >= starts;
	}

	/**
	 * Check whether a given date is selected and lies strictly inside a selected range
	 * (i.e., it is part of at least one selected range but is not the start or end of that range).
	 *
	 * This method returns true only if:
	 *  - `this.isSelected(dateTest)` is true (the date is considered selected), and
	 *  - there exists at least one element in `this.datesSelected` for which
	 *    `dateSelected.isStart(dateTest)` and `dateSelected.isEnd(dateTest)` are both false.
	 *
	 * Notes:
	 *  - The exact equality/comparison semantics are delegated to `isSelected`, `isStart`
	 *    and `isEnd` implementations on the respective objects.
	 *  - `dateTest` is expected to be a valid Date. Behavior for null/undefined/invalid Date
	 *    values is not defined here.
	 *
	 * @private
	 * @param dateTest - The date to test.
	 * @returns True if the date is an interior day of at least one selected range; otherwise false.
	 */
	private existInARangeButNotABoundary(dateTest: Date): boolean {
		return this.datesSelected.some(dateSelected => dateSelected.isSelected(dateTest) && !dateSelected.isStart(dateTest) && !dateSelected.isEnd(dateTest));
	}

	getClasses(date: Date): string {
		return this.datesSelected.map(dateSelected => dateSelected.getClasses(date)).join(" ");
	}

	getTooltip(date: Date): string | null | undefined {
		return this.datesSelected.map(dateSelected => dateSelected.getTooltip(date)).filter(tooltip => tooltip).join(" + ");
	}

	computeHeuristics(): void {
		// Logic to compute heuristics on selected dates
		// use fibonacci sequence as heuristic points

		const fibonacci = [0, 1];
		for (let i = 2; i <= 10; i++) {
			fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
		}

		const heuristicPoints = this.datesSelected.reduce((acc, dateSelected) => {
			const days = dateSelected.getLengthInDays();
			return acc + (fibonacci[days] || 0);
		}, 0);
		console.log(`Heuristic Points: ${heuristicPoints}`);
	}

	optimizeVacations(vacationsNumber: VacationsNumber, year: number): void {
		// Logic to optimize vacations
	}
}
