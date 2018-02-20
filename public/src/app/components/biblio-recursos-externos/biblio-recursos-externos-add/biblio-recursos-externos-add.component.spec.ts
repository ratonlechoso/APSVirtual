import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioRecursosExternosAddComponent } from './biblio-recursos-externos-add.component';

describe('BiblioRecursosExternosAddComponent', () => {
  let component: BiblioRecursosExternosAddComponent;
  let fixture: ComponentFixture<BiblioRecursosExternosAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblioRecursosExternosAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblioRecursosExternosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
