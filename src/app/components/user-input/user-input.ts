import { Component, Input, input, signal, WritableSignal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCalendar } from "@angular/material/datepicker";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInputService } from '../../services/user-input-service';
import { MatAnchor, MatButton } from "@angular/material/button";

@Component({
	selector: 'app-user-input',
	imports: [MatFormField, MatLabel, MatInputModule, ReactiveFormsModule, MatAnchor, MatButton],
	templateUrl: './user-input.html',
	styleUrl: './user-input.scss',
})
export class UserInput {
	constructor(private userInput: UserInputService) { }

	userInputForm: FormGroup = new FormGroup({
		CP: new FormControl<number | null>(null, Validators.required),
		RTT: new FormControl<number | null>(null, Validators.required),
		Others: new FormControl<number | null>(null, Validators.required),
	});

	submitForm() {
		console.log("prout");
	}
}
