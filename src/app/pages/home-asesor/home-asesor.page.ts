import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from 'src/app/core/services/auth';

@Component({
  selector: 'app-home-asesor',
  templateUrl: './home-asesor.page.html',
  styleUrls: ['./home-asesor.page.scss'],
  standalone: false
})
export class HomeAsesorPage implements OnInit {
  profile: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getCurrentProfile();
    console.log('Perfil en Home Asesor:', this.profile);
  }

  async logout() {
    await this.authService.signOut();
  }
}