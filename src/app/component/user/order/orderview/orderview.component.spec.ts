import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderviewComponent } from './orderview.component';

describe('OrderviewComponent', () => {
  let component: OrderviewComponent;
  let fixture: ComponentFixture<OrderviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderviewComponent]
    });
    fixture = TestBed.createComponent(OrderviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
