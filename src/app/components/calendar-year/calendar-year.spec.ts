import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CalendarYear } from './calendar-year';

describe('CalendarYear', () => {
	let component: CalendarYear;
	let fixture: ComponentFixture<CalendarYear>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarYear],
			providers: [provideZonelessChangeDetection()],
		}).compileComponents();

		fixture = TestBed.createComponent(CalendarYear);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
