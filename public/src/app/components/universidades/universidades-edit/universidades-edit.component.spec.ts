import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadesEditComponent } from './universidades-edit.component';

describe('UniversidadesEditComponent', () => {
  let component: UniversidadesEditComponent;
  let fixture: ComponentFixture<UniversidadesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversidadesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversidadesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
