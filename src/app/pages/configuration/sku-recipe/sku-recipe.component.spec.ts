import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuRecipeComponent } from './sku-recipe.component';

describe('SkuRecipeComponent', () => {
  let component: SkuRecipeComponent;
  let fixture: ComponentFixture<SkuRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkuRecipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkuRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
