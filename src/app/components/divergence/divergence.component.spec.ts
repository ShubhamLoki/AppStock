import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivergenceComponent } from './divergence.component';

describe('HourlyDivergenceComponent', () => {
  let component: DivergenceComponent;
  let fixture: ComponentFixture<DivergenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DivergenceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivergenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
