import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMonth } from './calendar-month';

describe('CalendarMonth', () => {
  let component: CalendarMonth;
  let fixture: ComponentFixture<CalendarMonth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMonth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarMonth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
