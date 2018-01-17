import { TestBed, inject } from '@angular/core/testing';

import { DynamicMenuService } from './dynamic-menu.service';

describe('DynamicMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicMenuService]
    });
  });

  it('should be created', inject([DynamicMenuService], (service: DynamicMenuService) => {
    expect(service).toBeTruthy();
  }));
});
