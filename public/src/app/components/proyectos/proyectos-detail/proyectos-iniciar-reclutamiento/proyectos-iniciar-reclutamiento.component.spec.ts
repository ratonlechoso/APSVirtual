import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosIniciarReclutamientoComponent } from './proyectos-iniciar-reclutamiento.component';

describe('ProyectosIniciarReclutamientoComponent', () => {
  let component: ProyectosIniciarReclutamientoComponent;
  let fixture: ComponentFixture<ProyectosIniciarReclutamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosIniciarReclutamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosIniciarReclutamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
