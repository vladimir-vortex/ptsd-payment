import { TestBed } from '@angular/core/testing';

import { BgTestSoundService } from './bg-test-sound.service';

describe('BgTestSoundService', () => {
  let service: BgTestSoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BgTestSoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
