import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarYear } from './calendar-year';

describe('CalendarYear', () => {
  let component: CalendarYear;
  let fixture: ComponentFixture<CalendarYear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarYear]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarYear);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
