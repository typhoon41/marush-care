import { Route } from '@angular/router';

export interface TranslatedRoute extends Route {
    key: string;
}

export abstract class BaseRoutingDefinition {
    abstract routes: TranslatedRoute[];

    readonly translateRoute = (key: string) => `/${this.routes.filter(route => route.key === key)[0].path}`;
    readonly lazyRoute = (key: string, path: string, loadCallback: () => Promise<unknown>) => ({
            key,
            path,
            loadComponent: loadCallback
        } as TranslatedRoute);
}
