import { TestBed } from '@angular/core/testing';

import { MywindowService } from './mywindow.service';

describe('MywindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MywindowService = TestBed.get(MywindowService);
    expect(service).toBeTruthy();
  });
});
