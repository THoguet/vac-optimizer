import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CalendarSettingsDialog } from '../dialog/calendar-settings-dialog/calendar-settings-dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'app-calendar-settings',
	imports: [MatButtonModule, MatDividerModule, MatIconModule],
	templateUrl: './calendar-settings.html',
	styleUrl: './calendar-settings.scss',
})
export class CalendarSettings {
	constructor(private dialog: MatDialog) {}

	openDialog() {
		this.dialog.open(CalendarSettingsDialog);
	}
}
