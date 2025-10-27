import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let guard: typeof authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = authGuard;
  });

  it('should be defined', () => {
    expect(guard).toBeTruthy();
  });
});
