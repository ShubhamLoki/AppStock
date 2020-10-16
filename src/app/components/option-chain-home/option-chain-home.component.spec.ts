import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionChainHomeComponent } from './option-chain-home.component';

describe('OptionChainHomeComponent', () => {
  let component: OptionChainHomeComponent;
  let fixture: ComponentFixture<OptionChainHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionChainHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionChainHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
