import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosCancelarComponent } from './proyectos-cancelar.component';

describe('ProyectosCancelarComponent', () => {
  let component: ProyectosCancelarComponent;
  let fixture: ComponentFixture<ProyectosCancelarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosCancelarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
