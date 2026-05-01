import { Routes } from '@angular/router';
import { Home } from './pages/home/home.component';
import { AuthComponent } from './pages/login/auth.component';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: AuthComponent },
];
