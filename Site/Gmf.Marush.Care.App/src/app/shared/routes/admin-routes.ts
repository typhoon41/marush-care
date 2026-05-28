import { isAdmin } from '@shared/guards/admin';
import { isUserAuthenticated } from '@shared/guards/authenticated';
import { lazyRoute } from './routes';

export class AdminRoutes {
    readonly routes = [
        lazyRoute('login', 'uloguj-se',
            () => import('@features/admin/authentication/login-page').then(module => module.LoginPage), [isAdmin]),
        lazyRoute('clients', 'admin/klijenti',
            () => import('@features/admin/clients/clients-page').then(module => module.ClientsPage), [isUserAuthenticated]),
        lazyRoute('clients-create', 'admin/klijent',
            () => import('@features/admin/clients/edit/clients-edit-page').then(module => module.ClientsEditPage), [isUserAuthenticated]),
        lazyRoute('clients-edit', 'admin/klijent/:id',
            () => import('@features/admin/clients/edit/clients-edit-page').then(module => module.ClientsEditPage), [isUserAuthenticated]),
        lazyRoute('calendar', 'admin/kalendar',
            () => import('@features/admin/calendar/calendar-page').then(module => module.CalendarPage), [isUserAuthenticated])
    ];
}
