import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioRecursosExternosListComponent } from './biblio-recursos-externos-list.component';

describe('BiblioRecursosExternosListComponent', () => {
  let component: BiblioRecursosExternosListComponent;
  let fixture: ComponentFixture<BiblioRecursosExternosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblioRecursosExternosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblioRecursosExternosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
