import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserSettingsService } from './user-settings-service';

describe('UserSettingsService', () => {
	let service: UserSettingsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		service = TestBed.inject(UserSettingsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
