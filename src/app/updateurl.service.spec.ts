import { TestBed } from '@angular/core/testing';

import { UpdateurlService } from './updateurl.service';

describe('UpdateurlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateurlService = TestBed.get(UpdateurlService);
    expect(service).toBeTruthy();
  });
});
