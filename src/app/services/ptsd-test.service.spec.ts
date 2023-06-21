import { TestBed } from '@angular/core/testing';

import { PtsdTestService } from './ptsd-test.service';

describe('PtsdTestService', () => {
  let service: PtsdTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PtsdTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
