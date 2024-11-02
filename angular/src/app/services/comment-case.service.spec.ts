import { TestBed } from '@angular/core/testing';

import { CommentCaseService } from './comment-case.service';

describe('CommentCaseService', () => {
  let service: CommentCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
