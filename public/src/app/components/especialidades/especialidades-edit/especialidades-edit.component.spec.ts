import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialidadesEditComponent } from './especialidades-edit.component';

describe('EspecialidadesEditComponent', () => {
  let component: EspecialidadesEditComponent;
  let fixture: ComponentFixture<EspecialidadesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspecialidadesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
