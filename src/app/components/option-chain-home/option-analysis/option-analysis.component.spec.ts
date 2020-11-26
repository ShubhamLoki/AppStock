import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionAnalysisComponent } from './option-analysis.component';

describe('OptionAnalysisComponent', () => {
  let component: OptionAnalysisComponent;
  let fixture: ComponentFixture<OptionAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
