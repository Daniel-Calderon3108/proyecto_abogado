import { TestBed } from '@angular/core/testing';

import { Rol2GuardService } from './rol2-guard.service';

describe('Rol2GuardService', () => {
  let service: Rol2GuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rol2GuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
