import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayInput } from './day-input';

describe('DayInput', () => {
	let component: DayInput;
	let fixture: ComponentFixture<DayInput>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DayInput],
		}).compileComponents();

		fixture = TestBed.createComponent(DayInput);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
