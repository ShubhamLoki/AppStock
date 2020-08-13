import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivergenceListComponent } from './divergence-list.component';

describe('DivergenceListComponent', () => {
  let component: DivergenceListComponent;
  let fixture: ComponentFixture<DivergenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivergenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivergenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
