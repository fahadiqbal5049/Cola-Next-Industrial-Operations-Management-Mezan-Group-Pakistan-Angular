import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedProductionComponent } from './planned-production.component';

describe('PlannedProductionComponent', () => {
  let component: PlannedProductionComponent;
  let fixture: ComponentFixture<PlannedProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedProductionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlannedProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
