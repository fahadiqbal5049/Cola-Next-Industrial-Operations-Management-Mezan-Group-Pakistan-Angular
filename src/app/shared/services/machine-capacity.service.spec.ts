import { TestBed } from '@angular/core/testing';

import { MachineCapacityService } from './machine-capacity.service';

describe('MachineCapacityService', () => {
  let service: MachineCapacityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineCapacityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
