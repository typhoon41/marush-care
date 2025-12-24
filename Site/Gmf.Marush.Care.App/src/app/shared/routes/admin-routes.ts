import { isAdmin } from '@shared/guards/admin';
import { isUserAuthenticated } from '@shared/guards/authenticated';
import { lazyRoute } from './routes';

export class AdminRoutes {
    readonly routes = [
        lazyRoute('login', 'uloguj-se',
            () => import('@features/admin/authentication/login-page').then(mod => mod.LoginPage), [isAdmin]),
        lazyRoute('clients', 'admin/klijenti',
            () => import('@features/admin/clients/clients-page').then(mod => mod.ClientsPage), [isUserAuthenticated]),
        lazyRoute('clients-create', 'admin/klijent',
            () => import('@features/admin/clients/edit/clients-edit-page').then(mod => mod.ClientsEditPage), [isUserAuthenticated]),
        lazyRoute('clients-edit', 'admin/klijent/:id',
            () => import('@features/admin/clients/edit/clients-edit-page').then(mod => mod.ClientsEditPage), [isUserAuthenticated])
    ];
}
