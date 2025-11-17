import { Injectable } from '@angular/core';

/**
 * Logger service that wraps console methods.
 * Can be configured to disable logging in production environments.
 */
@Injectable({
	providedIn: 'root',
})
export class LoggerService {
	private isProduction = false; // Can be configured based on environment

	/**
	 * Log an informational message
	 */
	log(message: string, ...args: unknown[]): void {
		if (!this.isProduction) {
			console.log(message, ...args);
		}
	}

	/**
	 * Log a warning message
	 */
	warn(message: string, ...args: unknown[]): void {
		if (!this.isProduction) {
			console.warn(message, ...args);
		}
	}

	/**
	 * Log an error message
	 */
	error(message: string, ...args: unknown[]): void {
		// Always log errors, even in production
		console.error(message, ...args);
	}

	/**
	 * Log a debug message
	 */
	debug(message: string, ...args: unknown[]): void {
		if (!this.isProduction) {
			console.debug(message, ...args);
		}
	}
}
