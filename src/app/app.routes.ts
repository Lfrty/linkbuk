import { Routes } from '@angular/router';
import { Home } from './pages/home/home.component';
import { AuthComponent } from './pages/login/auth.component';
import { HomeUsuarioComponent } from './pages/home-usuario/home-usuario.component';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: AuthComponent },
    { path: 'home', component: HomeUsuarioComponent }, // Home del usuario


    { path: '**', redirectTo: '' } // Error -> Redirige a landing page
];
