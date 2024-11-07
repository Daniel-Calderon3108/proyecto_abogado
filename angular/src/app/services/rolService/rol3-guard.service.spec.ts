import { TestBed } from '@angular/core/testing';

import { Rol3GuardService } from './rol3-guard.service';

describe('Rol3GuardService', () => {
  let service: Rol3GuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rol3GuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
