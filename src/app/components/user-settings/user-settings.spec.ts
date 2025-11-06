import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserSettings } from './user-settings';

describe('UserSettings', () => {
	let component: UserSettings;
	let fixture: ComponentFixture<UserSettings>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserSettings],
			providers: [provideZonelessChangeDetection()],
		}).compileComponents();

		fixture = TestBed.createComponent(UserSettings);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
