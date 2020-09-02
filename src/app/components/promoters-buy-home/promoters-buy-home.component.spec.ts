import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotersBuyHomeComponent } from './promoters-buy-home.component';

describe('PromotersBuyHomeComponent', () => {
  let component: PromotersBuyHomeComponent;
  let fixture: ComponentFixture<PromotersBuyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotersBuyHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotersBuyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
