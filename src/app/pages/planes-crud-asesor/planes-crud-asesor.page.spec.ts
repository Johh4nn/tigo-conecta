import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanesCrudAsesorPage } from './planes-crud-asesor.page';

describe('PlanesCrudAsesorPage', () => {
  let component: PlanesCrudAsesorPage;
  let fixture: ComponentFixture<PlanesCrudAsesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanesCrudAsesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
