import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosAlistarComponent } from './proyectos-alistar.component';

describe('ProyectosAlistarComponent', () => {
  let component: ProyectosAlistarComponent;
  let fixture: ComponentFixture<ProyectosAlistarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosAlistarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosAlistarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
