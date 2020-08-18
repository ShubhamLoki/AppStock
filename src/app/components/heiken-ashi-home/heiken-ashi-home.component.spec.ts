import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeikenAshiHomeComponent } from './heiken-ashi-home.component';

describe('HeikenAshiHomeComponent', () => {
  let component: HeikenAshiHomeComponent;
  let fixture: ComponentFixture<HeikenAshiHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeikenAshiHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeikenAshiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
