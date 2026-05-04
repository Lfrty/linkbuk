import { Routes } from '@angular/router';
import { Home } from './pages/home/home.component';
import { AuthComponent } from './pages/login/auth.component';
import { HomeUsuarioComponent } from './pages/home-usuario/home-usuario.component';
import { ListasComponent } from './components/listas/listas.component';
import { ResenaComponent } from './components/resena/resena.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: AuthComponent },
    { path: 'home', component: HomeUsuarioComponent },

    { path: 'listas', component: ListasComponent },
    { path: 'mis-resenas', component: ResenaComponent },

    { path: '**', redirectTo: '' }
];