import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CalendarSettingsService } from './calendar-settings-service';

describe('CalendarSettingsService', () => {
	let service: CalendarSettingsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		service = TestBed.inject(CalendarSettingsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize with default values', () => {
		expect(service.showWeekNumbers()).toBe(false);
		expect(service.samediMalin()).toBe(true);
	});

	it('should allow updating showWeekNumbers', () => {
		service.showWeekNumbers.set(true);
		expect(service.showWeekNumbers()).toBe(true);
	});

	it('should allow updating samediMalin', () => {
		service.samediMalin.set(false);
		expect(service.samediMalin()).toBe(false);
	});
});
