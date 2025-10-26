import { Injectable, signal } from '@angular/core';
import Holidays, { HolidaysTypes } from 'date-holidays';



@Injectable({
	providedIn: 'root'
})
export class UserInputService {
	calculateVacationOptimization(nbCP: number, nbRTT: number, nbOther: number, year: number, closedDays: Date[]) {
		// Logic to calculate vacation optimization based on user input
	}
}
