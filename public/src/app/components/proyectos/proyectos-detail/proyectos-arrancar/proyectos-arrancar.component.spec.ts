import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosArrancarComponent } from './proyectos-arrancar.component';

describe('ProyectosArrancarComponent', () => {
  let component: ProyectosArrancarComponent;
  let fixture: ComponentFixture<ProyectosArrancarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosArrancarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosArrancarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
