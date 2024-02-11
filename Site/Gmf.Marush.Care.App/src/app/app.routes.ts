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

    readonly routes: TranslatedRoute[] = [
        {
            key: 'default',
            path: '',
            pathMatch: 'full',
            redirectTo: this.home()
        },
        this.lazyRoute('home', $localize`:@@routes.home:početna`,
            () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent)),
        {
            key: 'unknown',
            path: '**',
            redirectTo: this.home()
        }
    ];
}
