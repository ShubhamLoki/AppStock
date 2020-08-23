import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivergenceHomeComponent } from './divergence-home.component';

describe('DivergenceHomeComponent', () => {
  let component: DivergenceHomeComponent;
  let fixture: ComponentFixture<DivergenceHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DivergenceHomeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivergenceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
