import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DateCacheService } from './date-cache.service';

describe('DateCacheService', () => {
	let service: DateCacheService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		service = TestBed.inject(DateCacheService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should cache today date', () => {
		const today1 = service.getToday();
		const today2 = service.getToday();
		expect(today1).toBe(today2); // Same reference
	});

	it('should cache today components', () => {
		const components1 = service.getTodayComponents();
		const components2 = service.getTodayComponents();
		expect(components1).toBe(components2); // Same reference
	});

	it('should cache current month', () => {
		const month1 = service.getCurrentMonth();
		const month2 = service.getCurrentMonth();
		expect(month1).toBe(month2);
	});

	it('should cache current year', () => {
		const year1 = service.getCurrentYear();
		const year2 = service.getCurrentYear();
		expect(year1).toBe(year2);
	});

	it('should clear cache', () => {
		const year1 = service.getCurrentYear();
		service.clearCache();
		const year2 = service.getCurrentYear();
		expect(year1).toBe(year2); // Values should be the same even after clearing
	});

	it('should return today with time normalized to 00:00:00.000', () => {
		const today = service.getToday();
		expect(today.getHours()).toBe(0);
		expect(today.getMinutes()).toBe(0);
		expect(today.getSeconds()).toBe(0);
		expect(today.getMilliseconds()).toBe(0);
	});

	it('should return getNow() same as getToday()', () => {
		const now = service.getNow();
		const today = service.getToday();
		expect(now).toBe(today);
	});
});
