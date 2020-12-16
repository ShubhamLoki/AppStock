import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsCompareComponent } from './options-compare.component';

describe('OptionsCompareComponent', () => {
  let component: OptionsCompareComponent;
  let fixture: ComponentFixture<OptionsCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
