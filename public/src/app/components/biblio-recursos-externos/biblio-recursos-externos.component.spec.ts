import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioRecursosExternos } from './biblio-recursos-externos.component';

describe('BiblioReseñasComponent', () => {
  let component: BiblioRecursosExternos;
  let fixture: ComponentFixture<BiblioRecursosExternos>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblioRecursosExternos ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblioRecursosExternos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
