import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DarkLightModeButton } from './dark-light-mode-button';

describe('DarkLightModeButton', () => {
	let component: DarkLightModeButton;
	let fixture: ComponentFixture<DarkLightModeButton>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DarkLightModeButton],
			providers: [provideZonelessChangeDetection()],
		}).compileComponents();

		fixture = TestBed.createComponent(DarkLightModeButton);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
