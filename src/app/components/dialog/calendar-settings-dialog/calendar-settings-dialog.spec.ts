import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSettingsDialog } from './calendar-settings-dialog';

describe('CalendarSettingsDialog', () => {
  let component: CalendarSettingsDialog;
  let fixture: ComponentFixture<CalendarSettingsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSettingsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSettingsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
