import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoPublicoPage } from './catalogo-publico.page';

describe('CatalogoPublicoPage', () => {
  let component: CatalogoPublicoPage;
  let fixture: ComponentFixture<CatalogoPublicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoPublicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
