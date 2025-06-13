import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftdetailsComponent } from './shiftdetails.component';

describe('ShiftdetailsComponent', () => {
  let component: ShiftdetailsComponent;
  let fixture: ComponentFixture<ShiftdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
