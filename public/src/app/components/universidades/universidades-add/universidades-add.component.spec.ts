import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadesAddComponent } from './universidades-add.component';

describe('UniversidadesAddComponent', () => {
  let component: UniversidadesAddComponent;
  let fixture: ComponentFixture<UniversidadesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversidadesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversidadesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
