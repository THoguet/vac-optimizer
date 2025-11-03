import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CalendarSettingsDialog } from './calendar-settings-dialog';

describe('CalendarSettingsDialog', () => {
	let component: CalendarSettingsDialog;
	let fixture: ComponentFixture<CalendarSettingsDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarSettingsDialog],
			providers: [
				provideZonelessChangeDetection(),
				{
					provide: MatDialogRef,
					useValue: {
						close: jasmine.createSpy('close'),
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CalendarSettingsDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have calendar settings service', () => {
		expect(component['calendarSettingsService']).toBeDefined();
	});

	it('should close dialog when closeDialog is called', () => {
		component.closeDialog();
		expect(component.dialogRef.close).toHaveBeenCalled();
	});
});
