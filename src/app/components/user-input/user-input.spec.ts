import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserInput } from './user-input';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserInputService } from '../../services/user-input-service';

describe('UserInput', () => {
	let component: UserInput;
	let fixture: ComponentFixture<UserInput>;
	let userInputService: UserInputService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserInput],
			providers: [provideZonelessChangeDetection(), provideAnimationsAsync()],
		}).compileComponents();

		fixture = TestBed.createComponent(UserInput);
		component = fixture.componentInstance;
		userInputService = TestBed.inject(UserInputService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with vacation days from service', () => {
		const vacationDays = userInputService.vacationNumberSignal();
		expect(vacationDays).toBeDefined();
		expect(Array.isArray(vacationDays)).toBe(true);
		expect(vacationDays.length).toBeGreaterThan(0);
	});

	it('should add a new vacation day', () => {
		const initialLength = userInputService.vacationNumberSignal().length;
		component.addDay();
		expect(userInputService.vacationNumberSignal().length).toBe(initialLength + 1);
	});

	it('should remove a vacation day', () => {
		const initialLength = userInputService.vacationNumberSignal().length;
		component.removeFromList(0);
		expect(userInputService.vacationNumberSignal().length).toBe(initialLength - 1);
	});
});
