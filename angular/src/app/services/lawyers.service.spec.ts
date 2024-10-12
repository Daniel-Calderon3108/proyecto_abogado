import { TestBed } from '@angular/core/testing';

import { LawyersService } from './lawyers.service';

describe('LawyersService', () => {
  let service: LawyersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LawyersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
