import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { CalendarSettingsService } from '../../../services/calendar-settings-service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
	selector: 'app-calendar-settings-dialog',
	imports: [MatButton, MatSlideToggle],
	templateUrl: './calendar-settings-dialog.html',
	styleUrl: './calendar-settings-dialog.scss',
})
export class CalendarSettingsDialog {
	constructor(
		public dialogRef: MatDialogRef<CalendarSettingsDialog>,
		protected calendarSettingsService: CalendarSettingsService,
	) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
