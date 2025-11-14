import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { isAdmin } from '@shared/guards/admin';
import { isUserAuthenticated } from '@shared/guards/authenticated';
import { TranslatedRoute } from '@shared/models/routing/translated-route';

export class RoutingDefinition {
    readonly translateRoute = (key: string) => `/${this.routes.filter(route => route.key === key)[0].path}`;
    readonly lazyRoute = (key: string, path: string, loadCallback: () => Promise<unknown>,
        guards: ((_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => MaybeAsync<GuardResult>)[] = []) => ({
            key,
            path,
            loadComponent: loadCallback,
            isProtected: path.startsWith('admin'),
            canActivate: guards.length > 0 ? guards : undefined
        } as TranslatedRoute);

    readonly home = () => $localize`:@@routes.home:početna` as string;
    readonly error = (errorType: string) =>
        `${$localize`:@@routes.error:greška`}/${errorType}` as string;

    readonly routes: TranslatedRoute[] = [
        {
            key: 'default',
            path: '',
            pathMatch: 'full',
            redirectTo: encodeURI(this.home())
        },
        this.lazyRoute('home', this.home(),
            () => import('./features/home/home-page').then(mod => mod.HomePage)),
        this.lazyRoute('login', 'uloguj-se',
            () => import('./features/admin/authentication/login-page').then(mod => mod.LoginPage), [isAdmin]),
        this.lazyRoute('clients', 'admin/klijenti',
            () => import('./features/admin/clients/clients-page').then(mod => mod.ClientsPage), [isUserAuthenticated]),
        this.lazyRoute('clients-edit', 'admin/klijent/:id',
            () => import('./features/admin/clients/edit/clients-edit-page').then(mod => mod.ClientsEditPage), [isUserAuthenticated]),
        this.lazyRoute('appointment', $localize`:@@routes.appointment:zakazivanje`,
            () => import('./features/appointment/appointment-page').then(mod => mod.AppointmentPage)),
        this.lazyRoute('request-sent', $localize`:@@routes.appointment.requested:zahtev-poslat`,
            () => import('./features/appointment/request-sent/request-sent-page')
                .then(mod => mod.RequestSentPage)),
        this.lazyRoute('client-notified', 'klijent-obavešten',
            () => import('./features/appointment/client-notified/client-notified-page')
                .then(mod => mod.ClientNotifiedPage)),
        this.lazyRoute('gallery', $localize`:@@routes.gallery:galerija`,
            () => import('./features/gallery/gallery-page').then(mod => mod.GalleryPage)),
        this.lazyRoute('contact', $localize`:@@routes.contact:kontakt`,
            () => import('./features/contact/contact-page').then(mod => mod.ContactPage)),
        this.lazyRoute('services', $localize`:@@routes.services:usluge`,
            () => import('./features/services/services-page').then(mod => mod.ServicesPage)),
        this.lazyRoute('error', `${this.error('')}:errorType`,
            () => import('./features/errors/error').then(mod => mod.ErrorPage)),
        {
            key: 'unknown',
            path: '**',
            redirectTo: encodeURI(this.error($localize`:@@routes.error.not-found:stranica-nije-pronađena`))
        }
    ];

    readonly isCurrentProtected = (location: Location) =>
        this.protectedRoutes.includes(location.path().substring(1));

    private readonly protectedRoutes: string[] = this.routes.filter(route => route.isProtected).map(route => route.path ?? '');
}
