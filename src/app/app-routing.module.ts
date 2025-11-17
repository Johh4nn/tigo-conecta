import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
import { PublicGuard } from './core/guards/public-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogo-publico',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [PublicGuard],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'catalogo-publico',
    loadChildren: () => import('./pages/catalogo-publico/catalogo-publico.module').then(m => m.CatalogoPublicoPageModule)
  },
  {
    path: 'home-usuario',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'usuario_registrado' },
    loadChildren: () => import('./pages/home-usuario/home-usuario.module').then(m => m.HomeUsuarioPageModule)
  },
  {
    path: 'home-asesor',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'asesor_comercial' },
    loadChildren: () => import('./pages/home-asesor/home-asesor.module').then(m => m.HomeAsesorPageModule)
  },
  {
    path: '**',
    redirectTo: 'catalogo-publico'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }