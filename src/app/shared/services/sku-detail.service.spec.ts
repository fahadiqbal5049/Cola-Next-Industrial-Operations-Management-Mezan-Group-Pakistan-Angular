import { TestBed } from '@angular/core/testing';

import { SkuDetailService } from './sku-detail.service';

describe('SkuDetailService', () => {
  let service: SkuDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkuDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
