import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo-publico',
  templateUrl: './catalogo-publico.page.html',
  styleUrls: ['./catalogo-publico.page.scss'],
  standalone: false
})
export class CatalogoPublicoPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Catálogo Público - Usuario Invitado');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}