import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
	CalendarService,
	DayType,
	SelectedDate,
	SelectedDates,
} from './calendar-service';
import { DateRange } from '@angular/material/datepicker';

describe('CalendarService', () => {
	let service: CalendarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		service = TestBed.inject(CalendarService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getHolidays', () => {
		it('should return an array of holidays', () => {
			const holidays = service.getHolidays();
			expect(Array.isArray(holidays)).toBe(true);
			expect(holidays.length).toBeGreaterThan(0);
		});

		it('should cache holidays for the same year', () => {
			const holidays1 = service.getHolidays();
			const holidays2 = service.getHolidays();
			expect(holidays1).toEqual(holidays2);
		});
	});

	describe('static date calculation methods', () => {
		it('should calculate days in a week', () => {
			const week = CalendarService.daysInWeek(0, 0, 2024);
			expect(week.length).toBe(7);
		});

		it('should calculate weeks in a month', () => {
			const weeks = CalendarService.weeksInMonth(0, 2024);
			expect(weeks.length).toBeGreaterThan(0);
			expect(weeks.length).toBeLessThanOrEqual(6);
		});

		it('should calculate months in a year', () => {
			const months = CalendarService.monthsInYear(2024);
			expect(months.length).toBe(12);
		});

		it('should calculate months from now', () => {
			const months = service.monthsInAYearFromNow();
			expect(months.length).toBe(12);
		});

		it('should return week number for a date', () => {
			const date = new Date(2024, 0, 1);
			const weekNumber = CalendarService.getWeekNumber(date);
			expect(weekNumber).toBeGreaterThan(0);
			expect(weekNumber).toBeLessThanOrEqual(53);
		});
	});

	describe('getSelectedDatesForYear', () => {
		it('should return selected dates for the year', () => {
			const selectedDates = service.getSelectedDatesForYear();
			expect(selectedDates).toBeDefined();
			expect(selectedDates._datesSelected.length).toBeGreaterThan(0);
		});

		it('should include weekends', () => {
			const selectedDates = service.getSelectedDatesForYear();
			const hasWeekend = selectedDates._datesSelected.some(
				(date) => date.type === DayType.WEEKEND,
			);
			expect(hasWeekend).toBe(true);
		});

		it('should include holidays', () => {
			const selectedDates = service.getSelectedDatesForYear();
			const hasHoliday = selectedDates._datesSelected.some(
				(date) => date.type === DayType.CLOSED_DAY,
			);
			expect(hasHoliday).toBe(true);
		});

		it('should include today', () => {
			const selectedDates = service.getSelectedDatesForYear();
			const hasToday = selectedDates._datesSelected.some(
				(date) => date.type === DayType.TODAY,
			);
			expect(hasToday).toBe(true);
		});
	});

	describe('setWeekendSelection', () => {
		it('should add weekend for Saturday', () => {
			const selectedDates = new SelectedDates();
			const saturday = new Date(2024, 0, 6); // A Saturday
			service.setWeekendSelection(saturday, selectedDates);
			expect(selectedDates._datesSelected.length).toBeGreaterThan(0);
		});
	});
});

describe('SelectedDate', () => {
	it('should check if date is selected', () => {
		const date = new Date(2024, 0, 1);
		const selectedDate = new SelectedDate(
			DayType.CP,
			new DateRange<Date>(date, date),
		);
		expect(selectedDate.isSelected(date)).toBe(true);
	});

	it('should check if date is start', () => {
		const date = new Date(2024, 0, 1);
		const selectedDate = new SelectedDate(
			DayType.CP,
			new DateRange<Date>(date, date),
		);
		expect(selectedDate.isStart(date)).toBe(true);
	});

	it('should check if date is end', () => {
		const date = new Date(2024, 0, 1);
		const selectedDate = new SelectedDate(
			DayType.CP,
			new DateRange<Date>(date, date),
		);
		expect(selectedDate.isEnd(date)).toBe(true);
	});

	it('should return correct classes for date', () => {
		const date = new Date(2024, 0, 1);
		const selectedDate = new SelectedDate(
			DayType.CP,
			new DateRange<Date>(date, date),
		);
		const classes = selectedDate.getClasses(date);
		expect(classes).toContain(DayType.CP);
	});

	it('should return tooltip for selected date', () => {
		const date = new Date(2024, 0, 1);
		const selectedDate = new SelectedDate(
			DayType.CP,
			new DateRange<Date>(date, date),
		);
		const tooltip = selectedDate.getTooltip(date);
		expect(tooltip).toBeTruthy();
	});

	it('should calculate length in days', () => {
		const startDate = new Date(2024, 0, 1);
		const endDate = new Date(2024, 0, 3);
		const selectedDate = new SelectedDate(
			DayType.CP,
			new DateRange<Date>(startDate, endDate),
		);
		expect(selectedDate.getLengthInDays()).toBe(3);
	});

	it('should not mark TODAY as selected', () => {
		const date = new Date(2024, 0, 1);
		const selectedDate = new SelectedDate(
			DayType.TODAY,
			new DateRange<Date>(date, date),
		);
		expect(selectedDate.isSelected(date)).toBe(false);
	});
});

describe('SelectedDates', () => {
	it('should push selected dates', () => {
		const selectedDates = new SelectedDates();
		const date = new Date(2024, 0, 1);
		selectedDates.push(
			new SelectedDate(DayType.CP, new DateRange<Date>(date, date)),
		);
		expect(selectedDates._datesSelected.length).toBe(1);
	});

	it('should check if date is selected', () => {
		const selectedDates = new SelectedDates();
		const date = new Date(2024, 0, 1);
		selectedDates.push(
			new SelectedDate(DayType.CP, new DateRange<Date>(date, date)),
		);
		expect(selectedDates.isSelected(date)).toBe(true);
	});

	it('should group adjacent dates', () => {
		const selectedDates = new SelectedDates();
		const date1 = new Date(2024, 0, 1);
		const date2 = new Date(2024, 0, 2);
		selectedDates._datesSelected.push(
			new SelectedDate(DayType.CP, new DateRange<Date>(date1, date1)),
		);
		selectedDates._datesSelected.push(
			new SelectedDate(DayType.RTT, new DateRange<Date>(date2, date2)),
		);
		selectedDates.update();
		expect(selectedDates.datesSelected.length).toBeGreaterThan(2);
	});

	it('should compute heuristics', () => {
		const selectedDates = new SelectedDates();
		const date = new Date(2024, 0, 1);
		selectedDates.push(
			new SelectedDate(DayType.CP, new DateRange<Date>(date, date)),
		);
		const heuristic = selectedDates.computeHeuristics();
		expect(typeof heuristic).toBe('number');
	});

	it('should return correct classes', () => {
		const selectedDates = new SelectedDates();
		const date = new Date(2024, 0, 1);
		selectedDates.push(
			new SelectedDate(DayType.CP, new DateRange<Date>(date, date)),
		);
		const classes = selectedDates.getClasses(date);
		expect(classes).toContain(DayType.CP);
	});

	it('should return tooltip', () => {
		const selectedDates = new SelectedDates();
		const date = new Date(2024, 0, 1);
		selectedDates.push(
			new SelectedDate(DayType.CP, new DateRange<Date>(date, date)),
		);
		const tooltip = selectedDates.getTooltip(date);
		expect(tooltip).toBeTruthy();
	});
});
