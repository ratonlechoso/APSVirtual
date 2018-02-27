import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosSearchComponent } from './proyectos-search.component';

describe('ProyectosSearchComponent', () => {
  let component: ProyectosSearchComponent;
  let fixture: ComponentFixture<ProyectosSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
