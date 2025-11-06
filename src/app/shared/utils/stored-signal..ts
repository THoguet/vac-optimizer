import { signal, effect, WritableSignal } from '@angular/core';

export function storedSignal<T>(key: string, initialValue: T): WritableSignal<T> {
	// Try to restore the value from localStorage
	const storedValue = localStorage.getItem(key);
	const parsedValue = storedValue ? (JSON.parse(storedValue) as T) : initialValue;

	// Create the actual signal
	const s = signal(parsedValue);

	// Keep localStorage in sync whenever the signal changes
	effect(() => {
		const value = s();
		localStorage.setItem(key, JSON.stringify(value));
	});

	return s;
}
