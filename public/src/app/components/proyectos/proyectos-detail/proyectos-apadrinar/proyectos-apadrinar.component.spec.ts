import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosApadrinarComponent } from './proyectos-apadrinar.component';

describe('ProyectosApadrinarComponent', () => {
  let component: ProyectosApadrinarComponent;
  let fixture: ComponentFixture<ProyectosApadrinarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosApadrinarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosApadrinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
