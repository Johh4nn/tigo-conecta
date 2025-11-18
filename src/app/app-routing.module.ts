import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
import { PublicGuard } from './core/guards/public-guard';

const routes: Routes = [
  { path: '', redirectTo: 'catalogo-publico', pathMatch: 'full' },

  // 🔹 Rutas Públicas
  {
    path: 'login',
    canActivate: [PublicGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    canActivate: [PublicGuard],
    loadChildren: () =>
      import('./pages/register/register.module').then(m => m.RegisterPageModule),
  },
  {
    path: 'catalogo-publico',
    loadChildren: () =>
      import('./pages/catalogo-publico/catalogo-publico.module').then(
        m => m.CatalogoPublicoPageModule
      ),
  },

  // 🔹 Rutas Usuario Registrado
  {
    path: 'home-usuario',
    canActivate: [RoleGuard],
    data: { role: 'usuario_registrado' },
    loadChildren: () =>
      import('./pages/home-usuario/home-usuario.module').then(
        m => m.HomeUsuarioPageModule
      ),
  },
  {
    path: 'mis-contrataciones',
    canActivate: [RoleGuard],
    data: { role: 'usuario_registrado' },
    loadChildren: () =>
      import('./pages/mis-contrataciones/mis-contrataciones.module').then(
        m => m.MisContratacionesPageModule
      ),
  },

  // 🔹 Rutas Asesor Comercial
  {
    path: 'home-asesor',
    canActivate: [RoleGuard],
    data: { role: 'asesor_comercial' },
    loadChildren: () =>
      import('./pages/home-asesor/home-asesor.module').then(
        m => m.HomeAsesorPageModule
      ),
  },
  {
    path: 'planes-crud-asesor',
    canActivate: [RoleGuard],
    data: { role: 'asesor_comercial' },
    loadChildren: () =>
      import('./pages/planes-crud-asesor/planes-crud-asesor.module').then(
        m => m.PlanesCrudAsesorPageModule
      ),
  },
  {
    path: 'contrataciones-asesor',
    canActivate: [RoleGuard],
    data: { role: 'asesor_comercial' },
    loadChildren: () =>
      import('./pages/contrataciones-asesor/contrataciones-asesor.module').then(
        m => m.ContratacionesAsesorPageModule
      ),
  },

  // 🔹 Chat (Ambos roles lo usan)
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/chat/chat.module').then(m => m.ChatPageModule),
  },

  // 🔹 Fallback (Siempre último)
  { path: '**', redirectTo: 'catalogo-publico' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
