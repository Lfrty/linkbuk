// api.ts
import { environment } from '../../../environments/environment';

export const API = {
    auth: {
        login: `${environment.apiUrl}/auth/login`,
        logout: `${environment.apiUrl}/auth/logout`,
        registar: `${environment.apiUrl}/auth/registrar`,
    },
};