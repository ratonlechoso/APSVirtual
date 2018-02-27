import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuProyectosComponent } from './navigation-menu-proyectos.component';

describe('NavigationMenuProyectosComponent', () => {
  let component: NavigationMenuProyectosComponent;
  let fixture: ComponentFixture<NavigationMenuProyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
