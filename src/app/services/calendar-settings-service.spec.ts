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
		expect(service.get('showWeekNumbers')()).toBe(false);
		expect(service.get('samediMalin')()).toBe(true);
	});

	it('should allow updating showWeekNumbers', () => {
		service.get('showWeekNumbers').set(true);
		expect(service.get('showWeekNumbers')()).toBe(true);
	});

	it('should allow updating samediMalin', () => {
		service.get('samediMalin').set(false);
		expect(service.get('samediMalin')()).toBe(false);
	});

	it('should provide settings array for UI iteration', () => {
		const settingsArray = service.settingsArray;
		expect(settingsArray.length).toBe(2);
		expect(settingsArray[0].id).toBe('showWeekNumbers');
		expect(settingsArray[1].id).toBe('samediMalin');
	});

	it('should return correct descriptions', () => {
		expect(service.getDescription('showWeekNumbers')).toBe('Afficher les numéros de semaine');
		expect(service.getDescription('samediMalin')).toBe('Activer le Samedi Malin');
	});
});
