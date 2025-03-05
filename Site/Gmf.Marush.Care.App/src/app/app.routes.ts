import { Route } from '@angular/router';

interface TranslatedRoute extends Route {
    key: string;
}
export class RoutingDefinition {
    readonly translateRoute = (key: string) => `/${this.routes.filter(route => route.key === key)[0].path}`;
    readonly lazyRoute = (key: string, path: string, loadCallback: () => Promise<unknown>) => ({
        key,
        path,
        loadComponent: loadCallback
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
            () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent)),
        this.lazyRoute('appointment', $localize`:@@routes.appointment:zakazivanje`,
            () => import('./features/appointment/appointment-page.component').then(mod => mod.AppointmentPageComponent)),
        this.lazyRoute('request-sent', $localize`:@@routes.appointment.requested:zahtev-poslat`,
            () => import('./features/appointment/request-sent/request-sent-page.component')
                .then(mod => mod.RequestSentPageComponent)),
        this.lazyRoute('client-notified', encodeURI('klijent-obavešten'),
            () => import('./features/appointment/client-notified/client-notified-page.component')
                .then(mod => mod.ClientNotifiedPageComponent)),
        this.lazyRoute('gallery', $localize`:@@routes.gallery:galerija`,
            () => import('./features/gallery/gallery-page.component').then(mod => mod.GalleryPageComponent)),
        this.lazyRoute('contact', $localize`:@@routes.contact:kontakt`,
            () => import('./features/contact/contact-page.component').then(mod => mod.ContactPageComponent)),
        this.lazyRoute('services', $localize`:@@routes.services:usluge`,
            () => import('./features/services/services-page.component').then(mod => mod.ServicesPageComponent)),
        this.lazyRoute('error', `${this.error('')}:errorType`,
            () => import('./features/errors/error.component').then(mod => mod.ErrorPageComponent)),
        {
            key: 'unknown',
            path: '**',
            redirectTo: encodeURI(this.error($localize`:@@routes.error.not-found:stranica-nije-pronađena`))
        }
    ];
}
