import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosReactivarComponent } from './proyectos-reactivar.component';

describe('ProyectosReactivarComponent', () => {
  let component: ProyectosReactivarComponent;
  let fixture: ComponentFixture<ProyectosReactivarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosReactivarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosReactivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
