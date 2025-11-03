import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserInputService } from './user-input-service';

describe('UserInput', () => {
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

	it('should initialize with random vacation numbers', () => {
		const vacations = service.vacationNumberSignal();
		expect(vacations.cp).toBeGreaterThanOrEqual(1);
		expect(vacations.cp).toBeLessThanOrEqual(9);
		expect(vacations.rtt).toBeGreaterThanOrEqual(1);
		expect(vacations.rtt).toBeLessThanOrEqual(9);
		expect(vacations.other).toBeGreaterThanOrEqual(1);
		expect(vacations.other).toBeLessThanOrEqual(9);
	});

	it('should update vacation number signal', () => {
		const newVacations = { cp: 5, rtt: 3, other: 2 };
		service.vacationNumberSignal.set(newVacations);
		expect(service.vacationNumberSignal()).toEqual(newVacations);
	});
});
