import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDetailsComponent } from './option-details.component';

describe('OptionDetailsComponent', () => {
  let component: OptionDetailsComponent;
  let fixture: ComponentFixture<OptionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
