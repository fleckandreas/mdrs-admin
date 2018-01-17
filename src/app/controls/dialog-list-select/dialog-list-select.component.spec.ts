import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListSelectComponent } from './dialog-list-select.component';

describe('DialogListSelectComponent', () => {
  let component: DialogListSelectComponent;
  let fixture: ComponentFixture<DialogListSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogListSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogListSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
