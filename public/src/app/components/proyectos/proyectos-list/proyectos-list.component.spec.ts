import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosListComponent } from './proyectos-list.component';

describe('ProyectosListComponent', () => {
  let component: ProyectosListComponent;
  let fixture: ComponentFixture<ProyectosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
