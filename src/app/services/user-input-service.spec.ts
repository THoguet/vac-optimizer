import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserInputService } from './user-input-service';
import { SelectableDayType, VacDay } from './calendar-service';

describe('UserInputService', () => {
	let service: UserInputService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		service = TestBed.inject(UserInputService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize with vacation days array', () => {
		const vacations = service.vacationNumberSignal();
		expect(Array.isArray(vacations)).toBe(true);
		expect(vacations.length).toBeGreaterThan(0);
	});

	it('should have vacation days with valid properties', () => {
		const vacations = service.vacationNumberSignal();
		vacations.forEach((day) => {
			expect(day.id).toBeDefined();
			expect(day.type).toBeDefined();
			expect(day.numberOfDays).toBeGreaterThanOrEqual(1);
			expect(day.numberOfDays).toBeLessThanOrEqual(9);
			expect(day.expiryDate).toBeInstanceOf(Date);
		});
	});

	it('should update vacation number signal', () => {
		const newVacations: VacDay[] = [
			{
				id: 'test-id',
				type: SelectableDayType.CP,
				numberOfDays: 5,
				expiryDate: new Date(),
			},
		];
		service.vacationNumberSignal.set(newVacations);
		expect(service.vacationNumberSignal()).toEqual(newVacations);
	});

	it('should create a new vacation day', () => {
		const newDay = service.createVacationDay();
		expect(newDay.id).toBeDefined();
		expect(newDay.type).toBe(SelectableDayType.CP);
		expect(newDay.numberOfDays).toBe(1);
		expect(newDay.expiryDate).toBeInstanceOf(Date);
	});
});
