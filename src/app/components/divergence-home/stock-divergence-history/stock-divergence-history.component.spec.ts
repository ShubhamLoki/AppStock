import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDivergenceHistoryComponent } from './stock-divergence-history.component';

describe('HourlyDivergenceComponent', () => {
  let component: StockDivergenceHistoryComponent;
  let fixture: ComponentFixture<StockDivergenceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockDivergenceHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDivergenceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
