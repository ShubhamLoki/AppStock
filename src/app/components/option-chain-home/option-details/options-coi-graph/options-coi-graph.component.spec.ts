import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsCoiGraphComponent } from './options-coi-graph.component';

describe('OptionsCoiGraphComponent', () => {
  let component: OptionsCoiGraphComponent;
  let fixture: ComponentFixture<OptionsCoiGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsCoiGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsCoiGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
