import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciasCreateComponent } from './experiencias-create.component';

describe('ExperienciasCreateComponent', () => {
  let component: ExperienciasCreateComponent;
  let fixture: ComponentFixture<ExperienciasCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciasCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciasCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
