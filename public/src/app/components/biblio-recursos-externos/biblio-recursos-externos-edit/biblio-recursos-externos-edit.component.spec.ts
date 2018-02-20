import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioRecursosExternosEditComponent } from './biblio-recursos-externos-edit.component';

describe('BiblioRecursosExternosEditComponent', () => {
  let component: BiblioRecursosExternosEditComponent;
  let fixture: ComponentFixture<BiblioRecursosExternosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblioRecursosExternosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblioRecursosExternosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
