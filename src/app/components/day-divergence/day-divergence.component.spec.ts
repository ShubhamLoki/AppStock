import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDivergenceComponent } from './day-divergence.component';

describe('DayDivergenceComponent', () => {
  let component: DayDivergenceComponent;
  let fixture: ComponentFixture<DayDivergenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayDivergenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayDivergenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
