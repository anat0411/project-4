import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachInCartComponent } from './serach-in-cart.component';

describe('SerachInCartComponent', () => {
  let component: SerachInCartComponent;
  let fixture: ComponentFixture<SerachInCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerachInCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerachInCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
