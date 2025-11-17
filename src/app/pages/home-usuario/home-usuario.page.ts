import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from 'src/app/core/services/auth';

@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.page.html',
  styleUrls: ['./home-usuario.page.scss'],
  standalone: false
})
export class HomeUsuarioPage implements OnInit {
  profile: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getCurrentProfile();
    console.log('Perfil en Home Usuario:', this.profile);
  }

  async logout() {
    await this.authService.signOut();
  }
}