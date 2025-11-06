import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserInput } from './user-input';

describe('UserInput', () => {
	let component: UserInput;
	let fixture: ComponentFixture<UserInput>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserInput],
			providers: [provideZonelessChangeDetection()],
		}).compileComponents();

		fixture = TestBed.createComponent(UserInput);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize form with values from service', () => {
		expect(component.userInputForm).toBeDefined();
		expect(component.userInputForm.get('CP')).toBeDefined();
		expect(component.userInputForm.get('RTT')).toBeDefined();
		expect(component.userInputForm.get('Others')).toBeDefined();
	});

	it('should have valid form controls', () => {
		const cpControl = component.userInputForm.get('CP');
		const rttControl = component.userInputForm.get('RTT');
		const othersControl = component.userInputForm.get('Others');

		expect(cpControl).toBeTruthy();
		expect(rttControl).toBeTruthy();
		expect(othersControl).toBeTruthy();
	});
});
