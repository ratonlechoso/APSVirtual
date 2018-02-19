import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciasDetailComponent } from './experiencias-detail.component';

describe('ExperienciasDetailComponent', () => {
  let component: ExperienciasDetailComponent;
  let fixture: ComponentFixture<ExperienciasDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciasDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciasDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
