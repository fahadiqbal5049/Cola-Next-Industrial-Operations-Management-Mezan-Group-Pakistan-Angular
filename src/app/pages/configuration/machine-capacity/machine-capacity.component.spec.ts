import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCapacityComponent } from './machine-capacity.component';

describe('MachineCapacityComponent', () => {
  let component: MachineCapacityComponent;
  let fixture: ComponentFixture<MachineCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineCapacityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
