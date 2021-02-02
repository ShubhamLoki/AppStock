import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsGraphComponent } from './options-graph.component';

describe('OptionsGraphComponent', () => {
  let component: OptionsGraphComponent;
  let fixture: ComponentFixture<OptionsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
