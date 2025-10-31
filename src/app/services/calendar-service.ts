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

	// Get selected dates from current date to the next year
	getSelectedDatesFromNow(): SelectedDates {
		const holidays = this.getHolidays();
		let selectedDates: SelectedDates = new SelectedDates();
		// Logic to populate selectedDates from now until the next year
		return selectedDates;
	}

	getSelectedDatesForYear(): SelectedDates {
		const holidays = this.getHolidays();
		const monthInAYear = CalendarService.monthsInAYearFromNow();
		let selectedDates: SelectedDates = new SelectedDates();
		for (const weeksInAMonth of monthInAYear) {
			for (const daysInAWeek of weeksInAMonth) {
				for (const day of daysInAWeek) {
					if (day) {
						this.setWeekendSelection(day, selectedDates);
						if (holidays.some(holiday => holiday.getTime() === day.getTime())) {
							selectedDates._datesSelected.push(new SelectedDate(DayType.CLOSED_DAY, new DateRange<Date>(day, day)));
						}
						if (day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() && day.getFullYear() === new Date().getFullYear()) {
							selectedDates._datesSelected.push(new SelectedDate(DayType.TODAY, new DateRange<Date>(day, day)));
						}
					}
				}
			}
		}
		selectedDates.update();
		return selectedDates;
	}

	setWeekendSelection(date: Date, selectedDates: SelectedDates) {
		if (date.getDay() === 6) {
			selectedDates._datesSelected.push(new SelectedDate(DayType.WEEKEND, new DateRange<Date>(date, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))));
		}
		if (date.getDate() === 1 && date.getDay() === 0) {
			selectedDates._datesSelected.push(new SelectedDate(DayType.WEEKEND, new DateRange<Date>(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1), date)));
		}
	}


	getHolidays(): Date[] {
		// Logic to return holidays for the given year
		const hd = new Holidays('FR', allTypesOptions);
		const holidays = hd.getHolidays(new Date().getFullYear(), lang);
		const holidaysPlusOne = hd.getHolidays(new Date().getFullYear() + 1, lang);
		holidays.push(...holidaysPlusOne);
		let holidaysDate: Date[] = holidays.map(holiday => new Date(holiday.date));
		return holidaysDate;
	}

	static daysInWeek(weekIndex: number, monthIndex: number, year: number): Week {
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

	static weeksInMonth(monthIndex: number, year: number): Month {
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


	static monthsInYear(year: number): Year {
		const months: Year = [];
		for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
			months.push(this.weeksInMonth(monthIndex, year));
		}
		return months;
	}


	static monthsInAYearFromNow(): Year {
		const months: Year = [];
		const currentMonthIndex = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		for (let i = 0; i < 12; i++) {
			const monthIndex = (currentMonthIndex + i) % 12;
			const year = currentYear + Math.floor((currentMonthIndex + i) / 12);
			months.push(this.weeksInMonth(monthIndex, year));
		}
		return months;
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

export enum DayType {
	WEEKEND = "weekend",
	CLOSED_DAY = "closed-day",
	RTT = "rtt",
	CP = "cp",
	OTHER = "other",
	TODAY = "today",
}

export const tooltipTypeMapping: { [key in DayType]: string } = {
	[DayType.WEEKEND]: "Weekend",
	[DayType.CLOSED_DAY]: "Jour Férié",
	[DayType.RTT]: "RTT",
	[DayType.CP]: "Congé Payé",
	[DayType.OTHER]: "Autre",
	[DayType.TODAY]: "Aujourd'hui",
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
	type: DayType | null;
	range: DateRange<Date>;

	constructor(type: DayType | null, range: DateRange<Date>) {
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
		let returnType: DayType | string = "";
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

	update(): void {
		this.datesSelected = this._datesSelected.slice();
		this.grouping();
	}

	push(selectedDate: SelectedDate) {
		this._datesSelected.push(selectedDate);
		this.datesSelected = this._datesSelected.slice();
		this.grouping();
	}

	// make a "mother group" with type = null when two or more groups are adjacent or overlapping; keep the children groups
	grouping(): void {
		if (this._datesSelected.length <= 1) {
			return;
		}

		// Sort dates by start date
		const sorted = [...this._datesSelected].sort((a, b) => {
			const aStart = a.range.start?.getTime() ?? 0;
			const bStart = b.range.start?.getTime() ?? 0;
			return aStart - bStart;
		});

		// Group adjacent or overlapping dates
		const groups: SelectedDate[][] = [];
		let currentGroup: SelectedDate[] = [sorted[0]];

		for (let i = 1; i < sorted.length; i++) {
			const current = sorted[i];
			const previous = sorted[i - 1];

			const prevEnd = previous.range.end?.getTime() ?? 0;
			const currStart = current.range.start?.getTime() ?? 0;

			// Check if dates are adjacent (next day) or overlapping
			const oneDayInMs = 24 * 60 * 60 * 1000;
			const isAdjacent = currStart - prevEnd <= oneDayInMs;

			if (isAdjacent) {
				currentGroup.push(current);
			} else {
				if (currentGroup.length > 1) {
					groups.push(currentGroup);
				}
				currentGroup = [current];
			}
		}

		// Add the last group if it has more than one element
		if (currentGroup.length > 1) {
			groups.push(currentGroup);
		}

		// Create mother groups and rebuild datesSelected
		const result: SelectedDate[] = [...this._datesSelected];

		for (const group of groups) {
			const groupStart = group.reduce((min, date) => {
				const start = date.range.start?.getTime() ?? 0;
				return min === 0 ? start : Math.min(min, start);
			}, 0);

			const groupEnd = group.reduce((max, date) => {
				const end = date.range.end?.getTime() ?? 0;
				return Math.max(max, end);
			}, 0);

			const motherGroup = new SelectedDate(
				null,
				new DateRange<Date>(new Date(groupStart), new Date(groupEnd))
			);

			result.push(motherGroup);
		}

		this.datesSelected = result;
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

	computeHeuristics(): number {
		if (this.datesSelected.length === 0) {
			return 0;
		}

		let totalScore = 0;

		// Sort all dates by start date to find next closest dates
		const sorted = [...this.datesSelected].filter(date => date.type !== null).sort((a, b) => {
			const aStart = a.range.start?.getTime() ?? 0;
			const bStart = b.range.start?.getTime() ?? 0;
			return aStart - bStart;
		});

		// PRIMARY: Optimize adjacency - reduce "little holes" between vacation periods
		for (let i = 0; i < sorted.length - 1; i++) {
			const current = sorted[i];
			const next = sorted[i + 1];

			// Get dates as UTC strings to remove timezone issues
			const currentEndDate = new Date(current.range.end ?? new Date());
			const nextStartDate = new Date(next.range.start ?? new Date());

			// Convert to date-only strings (YYYY-MM-DD) to compare calendar days
			const currentEndString = currentEndDate.toISOString().split('T')[0];
			const nextStartString = nextStartDate.toISOString().split('T')[0];

			// Parse back to dates at UTC midnight
			const currentEndDateNormalized = new Date(currentEndString + 'T00:00:00Z');
			const nextStartDateNormalized = new Date(nextStartString + 'T00:00:00Z');

			const currentEndTime = currentEndDateNormalized.getTime();
			const nextStartTime = nextStartDateNormalized.getTime();

			const oneDayInMs = 24 * 60 * 60 * 1000;

			// Check if adjacent (next day) - this is the best case!
			if (nextStartTime - currentEndTime === oneDayInMs) {
				totalScore += 10; // Big bonus for adjacency
			} else if (nextStartTime > currentEndTime) {
				// Penalty based on days between the two dates
				const daysBetween = Math.floor((nextStartTime - currentEndTime) / oneDayInMs) - 1;
				// Ensure daysBetween is non-negative before taking sqrt
				totalScore -= (Math.sqrt(Math.max(0, daysBetween)));
			}
		}

		// SECONDARY: Penalize uneven monthly distribution to encourage spread
		const monthCounts = new Map<number, number>(); // Use year*12+month as key to avoid strings
		for (const selectedDate of this.datesSelected) {
			if (!selectedDate.range.start || !selectedDate.range.end) continue;

			// Count days in this selected date range
			const daysInRange = selectedDate.getLengthInDays();

			// For each day in the range, add it to the appropriate month
			let currentDate = new Date(selectedDate.range.start);
			for (let i = 0; i < daysInRange; i++) {
				const monthKey = currentDate.getFullYear() * 12 + currentDate.getMonth();
				monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);
				currentDate.setDate(currentDate.getDate() + 1);
			}
		}

		// Apply small penalty for uneven distribution (secondary priority)
		for (const count of monthCounts.values()) {
			totalScore -= count; // Smaller penalty than gap filling
		}

		return totalScore;
	}

	optimizeVacations(vacationsNumber: VacationsNumber): void {
		this.samediMalin(vacationsNumber);
		while (vacationsNumber.cp > 0) {
			const result = this.lookForVacation(DayType.CP);
			if (result.heuristic === -1) {
				break;
			}
			vacationsNumber.cp -= 1;
		}
		while (vacationsNumber.rtt > 0) {
			const result = this.lookForVacation(DayType.RTT);
			if (result.heuristic === -1) {
				break;
			}
			vacationsNumber.rtt -= 1;
		}
		while (vacationsNumber.other > 0) {
			const result = this.lookForVacation(DayType.OTHER);
			if (result.heuristic === -1) {
				break;
			}
			vacationsNumber.other -= 1;
		}
	}

	samediMalin(vacationsNumber: VacationsNumber): void {
		const samedi_ferie = this.datesSelected.filter(date => date.type === DayType.CLOSED_DAY && date.range.start?.getDay() === 6);

		for (const holiday of samedi_ferie) {
			if (!holiday.range.start) continue;

			// Skip if no CP days available
			if (vacationsNumber.cp < 2) {
				continue;
			}

			// Get the Saturday date (holiday) and the following Sunday
			const saturdayDate = new Date(holiday.range.start);
			const sundayDate = new Date(saturdayDate);
			sundayDate.setDate(saturdayDate.getDate() + 1);

			// Calculate dates for all three strategies (2 CP days total each)
			// Strategy 1: 2 days before (Thursday + Friday)
			const twoDaysBefore1 = new Date(saturdayDate);
			twoDaysBefore1.setDate(saturdayDate.getDate() - 2);
			const twoDaysBefore2 = new Date(saturdayDate);
			twoDaysBefore2.setDate(saturdayDate.getDate() - 1);

			// Strategy 2: 2 days after (Monday + Tuesday)
			const twoDaysAfter1 = new Date(sundayDate);
			twoDaysAfter1.setDate(sundayDate.getDate() + 1);
			const twoDaysAfter2 = new Date(sundayDate);
			twoDaysAfter2.setDate(sundayDate.getDate() + 2);

			// Strategy 3: 1 day before + 1 day after (Friday + Monday)
			const oneDayBefore = new Date(saturdayDate);
			oneDayBefore.setDate(saturdayDate.getDate() - 1);
			const oneDayAfter = new Date(sundayDate);
			oneDayAfter.setDate(sundayDate.getDate() + 1);

			// Check if we can apply each strategy
			const canApplyTwoBeforeStrategy =
				!this.isSelected(twoDaysBefore1) &&
				!this.isSelected(twoDaysBefore2);

			const canApplyTwoAfterStrategy =
				!this.isSelected(twoDaysAfter1) &&
				!this.isSelected(twoDaysAfter2);

			const canApplyMixedStrategy =
				!this.isSelected(oneDayBefore) &&
				!this.isSelected(oneDayAfter);

			// Test all applicable strategies and choose the one with the best heuristic score
			const strategies: { apply: () => void; heuristic: number }[] = [];
			const tempDatesBackup = [...this._datesSelected];

			if (canApplyTwoBeforeStrategy) {
				this.push(new SelectedDate(DayType.CP, new DateRange<Date>(twoDaysBefore1, twoDaysBefore2)));
				strategies.push({
					apply: () => {
						this._datesSelected = [...tempDatesBackup];
						this.push(new SelectedDate(DayType.CP, new DateRange<Date>(twoDaysBefore1, twoDaysBefore2)));
						vacationsNumber.cp -= 2;
						vacationsNumber.other += 1; // Reward: gain 1 other day
					},
					heuristic: this.computeHeuristics()
				});
				this._datesSelected = [...tempDatesBackup];
				this.datesSelected = this._datesSelected.slice();
				this.grouping();
			}

			if (canApplyTwoAfterStrategy) {
				this.push(new SelectedDate(DayType.CP, new DateRange<Date>(twoDaysAfter1, twoDaysAfter2)));
				strategies.push({
					apply: () => {
						this._datesSelected = [...tempDatesBackup];
						this.push(new SelectedDate(DayType.CP, new DateRange<Date>(twoDaysAfter1, twoDaysAfter2)));
						vacationsNumber.cp -= 2;
						vacationsNumber.other += 1; // Reward: gain 1 other day
					},
					heuristic: this.computeHeuristics()
				});
				this._datesSelected = [...tempDatesBackup];
				this.datesSelected = this._datesSelected.slice();
				this.grouping();
			}

			if (canApplyMixedStrategy) {
				this.push(new SelectedDate(DayType.CP, new DateRange<Date>(oneDayBefore, oneDayBefore)));
				this.push(new SelectedDate(DayType.CP, new DateRange<Date>(oneDayAfter, oneDayAfter)));
				strategies.push({
					apply: () => {
						this._datesSelected = [...tempDatesBackup];
						this.push(new SelectedDate(DayType.CP, new DateRange<Date>(oneDayBefore, oneDayBefore)));
						this.push(new SelectedDate(DayType.CP, new DateRange<Date>(oneDayAfter, oneDayAfter)));
						vacationsNumber.cp -= 2;
						vacationsNumber.other += 1; // Reward: gain 1 other day
					},
					heuristic: this.computeHeuristics()
				});
				this._datesSelected = [...tempDatesBackup];
				this.datesSelected = this._datesSelected.slice();
				this.grouping();
			}

			// Apply the strategy with the best heuristic score
			if (strategies.length > 0) {
				const bestStrategy = strategies.reduce((best, current) =>
					current.heuristic > best.heuristic ? current : best
				);
				bestStrategy.apply();
			}
		}
	}

	lookForVacation(vacType: DayType): { apply: () => void; heuristic: number } {
		const daysOfYear = CalendarService.monthsInAYearFromNow();
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		daysOfYear.forEach(month => {
			month.forEach(week => {
				week.forEach(day => {
					if (day) {
						if (day)
							day.setHours(0, 0, 0, 0);
						if (day && day < now) {
							week[week.indexOf(day)] = null;
						}
					}
				});
			});
		});
		const tempDatesBackup = [...this._datesSelected];
		let strategies: { apply: () => void; heuristic: number; value: Date }[] = [];
		for (const month of daysOfYear) {
			for (const week of month) {
				for (const day of week) {
					if (day && !this.isSelected(day)) {
						this._datesSelected = [...tempDatesBackup];
						this.datesSelected = this._datesSelected.slice();
						this.grouping();
						// mark these days as vacation
						const startDay = new Date(day);
						const endDay = new Date(day);
						this.datesSelected.push(new SelectedDate(vacType, new DateRange<Date>(startDay, endDay)));
						strategies.push({
							apply: () => {
								this._datesSelected = [...tempDatesBackup];
								this.push(new SelectedDate(vacType, new DateRange<Date>(startDay, endDay)));
							},
							heuristic: this.computeHeuristics(),
							value: startDay
						});
						this._datesSelected = [...tempDatesBackup];
						this.datesSelected = this._datesSelected.slice();
						this.grouping();
					}
				}
			}
		}
		// Apply the strategy with the best heuristic score
		if (strategies.length > 0) {
			const bestStrategy = strategies.reduce((best, current) =>
				current.heuristic > best.heuristic ? current : best
			);
			strategies.forEach(strategy => {
				console.log(`Strategy for ${strategy.value.toDateString()} has heuristic ${strategy.heuristic}`);
			});
			bestStrategy.apply();
			return bestStrategy;
		}
		return { apply: () => { }, heuristic: -1 };
	}
}
