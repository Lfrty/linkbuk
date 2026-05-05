import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthComponent } from './pages/login/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { ListasComponent } from './components/listas/listas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ResenaComponent } from './components/resena/resena.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // --- RUTAS PÚBLICAS (redirige a /home si ya está logueado) ---
    {
        path: '',
        component: LandingComponent,
        canActivate: [authGuard],
        data: { redireccionPorLogueado: true }
    },
    {
        path: 'login',
        component: AuthComponent,
        canActivate: [authGuard],
        data: { redireccionPorLogueado: true }
    },
    {
        path: 'register',
        component: AuthComponent,
        canActivate: [authGuard],
        data: { redireccionPorLogueado: true }
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

    // Para otras direcciones
    { path: '**', redirectTo: '' }
];