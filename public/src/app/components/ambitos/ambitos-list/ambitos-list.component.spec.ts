import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbitosListComponent } from './ambitos-list.component';

describe('AmbitosListComponent', () => {
  let component: AmbitosListComponent;
  let fixture: ComponentFixture<AmbitosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbitosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbitosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
