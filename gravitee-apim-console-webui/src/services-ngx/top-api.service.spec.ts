import { TestBed } from '@angular/core/testing';

import { TopApiService } from './top-api.service';

describe('TopApiService', () => {
  let service: TopApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
