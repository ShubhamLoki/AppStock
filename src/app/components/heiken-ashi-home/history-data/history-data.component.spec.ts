import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDataComponent } from './history-data.component';

describe('HistoryDataComponent', () => {
  let component: HistoryDataComponent;
  let fixture: ComponentFixture<HistoryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
