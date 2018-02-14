import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciasUpdateComponent } from './experiencias-update.component';

describe('ExperienciasUpdateComponent', () => {
  let component: ExperienciasUpdateComponent;
  let fixture: ComponentFixture<ExperienciasUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciasUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciasUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
