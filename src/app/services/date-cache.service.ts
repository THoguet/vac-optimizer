import { Injectable } from '@angular/core';

/**
 * Service to cache and provide commonly used date values.
 * This reduces redundant Date object creation across the application.
 */
@Injectable({
	providedIn: 'root',
})
export class DateCacheService {
	private _today: Date | null = null;
	private _todayComponents: { date: number; month: number; year: number } | null = null;
	private _currentMonth: number | null = null;
	private _currentYear: number | null = null;

	/**
	 * Get today's date (time set to 00:00:00.000)
	 */
	getToday(): Date {
		if (!this._today || this.isNewDay(this._today)) {
			this._today = new Date();
			this._today.setHours(0, 0, 0, 0);
			this._todayComponents = null; // Invalidate components cache
		}
		return this._today;
	}

	/**
	 * Get today's date components (date, month, year) for efficient comparison
	 */
	getTodayComponents(): { date: number; month: number; year: number } {
		if (!this._todayComponents || (this._today && this.isNewDay(this._today))) {
			const today = this.getToday();
			this._todayComponents = {
				date: today.getDate(),
				month: today.getMonth(),
				year: today.getFullYear(),
			};
		}
		return this._todayComponents;
	}

	/**
	 * Get current month (0-11)
	 */
	getCurrentMonth(): number {
		if (this._currentMonth === null || this.isNewMonth()) {
			this._currentMonth = new Date().getMonth();
		}
		return this._currentMonth;
	}

	/**
	 * Get current year
	 */
	getCurrentYear(): number {
		if (this._currentYear === null || this.isNewYear()) {
			this._currentYear = new Date().getFullYear();
		}
		return this._currentYear;
	}

	/**
	 * Get current date with time set to 00:00:00.000 (alias for getToday)
	 */
	getNow(): Date {
		return this.getToday();
	}

	/**
	 * Check if a cached date is from a previous day
	 */
	private isNewDay(cachedDate: Date): boolean {
		const now = new Date();
		return (
			cachedDate.getDate() !== now.getDate() ||
			cachedDate.getMonth() !== now.getMonth() ||
			cachedDate.getFullYear() !== now.getFullYear()
		);
	}

	/**
	 * Check if we're in a new month
	 */
	private isNewMonth(): boolean {
		return this._currentMonth !== null && this._currentMonth !== new Date().getMonth();
	}

	/**
	 * Check if we're in a new year
	 */
	private isNewYear(): boolean {
		return this._currentYear !== null && this._currentYear !== new Date().getFullYear();
	}

	/**
	 * Clear all caches (useful for testing)
	 */
	clearCache(): void {
		this._today = null;
		this._todayComponents = null;
		this._currentMonth = null;
		this._currentYear = null;
	}
}
