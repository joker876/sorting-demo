import { TestBed } from '@angular/core/testing';

import { SortingMethodsService } from './sorting-methods.service';

describe('SortingMethodsService', () => {
  let service: SortingMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortingMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
