import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFinishedPageComponent } from './order-finished-page.component';

describe('OrderFinishedPageComponent', () => {
  let component: OrderFinishedPageComponent;
  let fixture: ComponentFixture<OrderFinishedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFinishedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFinishedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
