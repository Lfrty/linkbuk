import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthComponent } from './pages/login/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { ListasComponent } from './features/listas/listas/listas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ResenaComponent } from './features/libros/resena/resena.component';
import { authGuard } from './core/guards/auth-guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './core/guards/admin-guard';
import { GestionUsuariosComponent } from './pages/admin/gestion-usuarios/gestion-usuarios.component';

export const routes: Routes = [
    // --- RUTAS PÚBLICAS (redirige a /home si ya está logueado) ---
    {
        path: '',
        component: LandingComponent,
        canActivate: [authGuard],
        data: { esInvitado: true }
    },
    {
        path: 'login',
        component: AuthComponent,
        canActivate: [authGuard],
        data: { esInvitado: true }
    },
    {
        path: 'register',
        component: AuthComponent,
        canActivate: [authGuard],
        data: { esInvitado: true }
    },

    // --- RUTAS PRIVADAS ---
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [authGuard]
    },
    {
        path: 'listas',
        component: ListasComponent,
        canActivate: [authGuard]
    },
    {
        path: 'mis-resenas',
        component: ResenaComponent,
        canActivate: [authGuard]
    },

    // --- RUTAS ADMIN ---

    {
        path: 'admin/home',
        component: AdminDashboardComponent, // Un layout diferente para el Admin
        canActivate: [adminGuard]
    },
    {
        path: 'admin/usuarios',
        component: GestionUsuariosComponent,
        canActivate: [adminGuard]
    },

    // Para otras direcciones
    { path: '**', redirectTo: '' }
];