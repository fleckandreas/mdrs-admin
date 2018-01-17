import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynPropertiesListComponent } from './dyn-properties-list.component';

describe('DynPropertiesListComponent', () => {
  let component: DynPropertiesListComponent;
  let fixture: ComponentFixture<DynPropertiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynPropertiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynPropertiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
