import { TestBed } from '@angular/core/testing';

import { ShiftdetailsService } from './shiftdetails.service';

describe('ShiftdetailsService', () => {
  let service: ShiftdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
