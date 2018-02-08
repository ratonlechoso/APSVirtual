import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciasSearchComponent } from './experiencias-search.component';

describe('ExperienciasSearchComponent', () => {
  let component: ExperienciasSearchComponent;
  let fixture: ComponentFixture<ExperienciasSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciasSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
