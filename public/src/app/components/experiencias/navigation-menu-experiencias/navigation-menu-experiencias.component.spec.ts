import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuExperienciasComponent } from './navigation-menu-experiencias.component';

describe('NavigationMenuExperienciasComponent', () => {
  let component: NavigationMenuExperienciasComponent;
  let fixture: ComponentFixture<NavigationMenuExperienciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuExperienciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuExperienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
