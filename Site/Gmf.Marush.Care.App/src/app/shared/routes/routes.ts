import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { TranslatedRoute } from '@shared/models/routing/translated-route';
import { AdminRoutes } from './admin-routes';
import { AppointmentRoutes } from './appointment-routes';

export const lazyRoute = (key: string, path: string, loadCallback: () => Promise<unknown>,
    guards: ((_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => MaybeAsync<GuardResult>)[] = []) => ({
        key,
        path,
        loadComponent: loadCallback,
        isProtected: path.startsWith('admin'),
        canActivate: guards.length > 0 ? guards : undefined
    } as TranslatedRoute);

export class RoutingDefinition {
    readonly translateRoute = (key: string) => `/${this.routes.filter(route => route.key === key)[0].path}`;

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
        lazyRoute('home', this.home(),
            () => import('@features/home/home-page').then(mod => mod.HomePage)),
        ...new AppointmentRoutes().routes,
        lazyRoute('gallery', $localize`:@@routes.gallery:galerija`,
            () => import('@features/gallery/gallery-page').then(mod => mod.GalleryPage)),
        lazyRoute('contact', $localize`:@@routes.contact:kontakt`,
            () => import('@features/contact/contact-page').then(mod => mod.ContactPage)),
        lazyRoute('services', $localize`:@@routes.services:usluge`,
            () => import('@features/services/services-page').then(mod => mod.ServicesPage)),
        ...new AdminRoutes().routes,
        lazyRoute('error', `${this.error('')}:errorType`,
            () => import('@features/errors/error').then(mod => mod.ErrorPage)),
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
