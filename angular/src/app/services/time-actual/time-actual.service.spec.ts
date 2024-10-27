import { TestBed } from '@angular/core/testing';

import { TimeActualService } from './time-actual.service';

describe('TimeActualService', () => {
  let service: TimeActualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeActualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
