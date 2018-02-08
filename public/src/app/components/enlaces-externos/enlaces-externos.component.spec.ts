import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnlacesExternosComponent } from './enlaces-externos.component';

describe('EnlacesExternosComponent', () => {
  let component: EnlacesExternosComponent;
  let fixture: ComponentFixture<EnlacesExternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnlacesExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnlacesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
