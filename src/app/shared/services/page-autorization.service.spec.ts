import { TestBed } from '@angular/core/testing';

import { PageAutorizationService } from './page-autorization.service';

describe('PageAutorizationService', () => {
  let service: PageAutorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageAutorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
