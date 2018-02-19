import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialidadesAddComponent } from './especialidades-add.component';

describe('EspecialidadesAddComponent', () => {
  let component: EspecialidadesAddComponent;
  let fixture: ComponentFixture<EspecialidadesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspecialidadesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
