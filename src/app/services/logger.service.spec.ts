import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
	let service: LoggerService;
	let consoleLogSpy: jasmine.Spy;
	let consoleWarnSpy: jasmine.Spy;
	let consoleErrorSpy: jasmine.Spy;
	let consoleDebugSpy: jasmine.Spy;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LoggerService);

		// Spy on console methods
		consoleLogSpy = spyOn(console, 'log');
		consoleWarnSpy = spyOn(console, 'warn');
		consoleErrorSpy = spyOn(console, 'error');
		consoleDebugSpy = spyOn(console, 'debug');
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should log messages', () => {
		service.log('test message');
		expect(consoleLogSpy).toHaveBeenCalledWith('test message');
	});

	it('should log warnings', () => {
		service.warn('test warning');
		expect(consoleWarnSpy).toHaveBeenCalledWith('test warning');
	});

	it('should log errors', () => {
		service.error('test error');
		expect(consoleErrorSpy).toHaveBeenCalledWith('test error');
	});

	it('should log debug messages', () => {
		service.debug('test debug');
		expect(consoleDebugSpy).toHaveBeenCalledWith('test debug');
	});

	it('should pass additional arguments to console methods', () => {
		const arg1 = { key: 'value' };
		const arg2 = [1, 2, 3];
		service.log('test', arg1, arg2);
		expect(consoleLogSpy).toHaveBeenCalledWith('test', arg1, arg2);
	});
});
