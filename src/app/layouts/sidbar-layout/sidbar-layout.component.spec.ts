import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidbarLayoutComponent } from './sidbar-layout.component';

describe('SidbarLayoutComponent', () => {
  let component: SidbarLayoutComponent;
  let fixture: ComponentFixture<SidbarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidbarLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidbarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
