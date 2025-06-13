import { TestBed } from '@angular/core/testing';

import { SkuRecipeService } from './sku-recipe.service';

describe('SkuRecipeService', () => {
  let service: SkuRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkuRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
