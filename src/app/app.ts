import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { UserInput } from './components/user-input/user-input';
import { CalendarYear } from './components/calendar-year/calendar-year';
import { DarkLightModeButton } from './components/dark-light-mode-button/dark-light-mode-button';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-root',
	imports: [
		MatDatepickerModule,
		MatDivider,
		UserInput,
		CalendarYear,
		DarkLightModeButton,
		DarkLightModeButton,
		MatIcon,
	],
	templateUrl: './app.html',
	styleUrl: './app.scss',
	providers: [provideNativeDateAdapter()],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected readonly title = signal('vac-optimizer');
}
