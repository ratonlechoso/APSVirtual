import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosFinalizarComponent } from './proyectos-finalizar.component';

describe('ProyectosFinalizarComponent', () => {
  let component: ProyectosFinalizarComponent;
  let fixture: ComponentFixture<ProyectosFinalizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosFinalizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosFinalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
