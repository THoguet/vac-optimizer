import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { DayInput } from './day-input';
import { SelectableDayType, VacDay } from '../../../services/calendar-service';

describe('DayInput', () => {
	let component: DayInput;
	let fixture: ComponentFixture<DayInput>;

	const mockVacDay: VacDay = {
		id: 'test-id',
		type: SelectableDayType.CP,
		numberOfDays: 5,
		expiryDate: new Date('2025-12-31'),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DayInput],
			providers: [provideAnimationsAsync()],
		}).compileComponents();

		fixture = TestBed.createComponent(DayInput);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('day', mockVacDay);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
