import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ThemeService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with system preference', () => {
    expect(service.isLightMode()).toBeDefined();
  });

  it('should toggle theme', () => {
    const initialMode = service.isLightMode();
    service.toggleTheme();
    expect(service.isLightMode()).toBe(!initialMode);
  });

  it('should force light mode when specified', () => {
    service.toggleTheme(true);
    expect(service.isLightMode()).toBe(true);
    expect(document.body.classList.contains('light-mode')).toBe(true);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });

  it('should force dark mode when specified', () => {
    service.toggleTheme(false);
    expect(service.isLightMode()).toBe(false);
    expect(document.body.classList.contains('light-mode')).toBe(false);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });
});
