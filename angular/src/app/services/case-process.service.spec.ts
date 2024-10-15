import { TestBed } from '@angular/core/testing';

import { CaseProcessService } from './case-process.service';

describe('CaseProcessService', () => {
  let service: CaseProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
