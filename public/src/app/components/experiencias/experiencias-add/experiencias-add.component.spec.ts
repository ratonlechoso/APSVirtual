import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciasAddComponent } from './experiencias-add.component';

describe('ExperienciasAddComponent', () => {
  let component: ExperienciasAddComponent;
  let fixture: ComponentFixture<ExperienciasAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciasAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
