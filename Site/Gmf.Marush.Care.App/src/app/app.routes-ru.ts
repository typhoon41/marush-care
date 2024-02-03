import { BaseRoutingDefinition, TranslatedRoute } from './shared/models/routing.model';

export class RoutingDefinition extends BaseRoutingDefinition {
    override routes: TranslatedRoute[] = [
        {
            key: 'default',
            path: '',
            pathMatch: 'full',
            redirectTo: 'домашняя'
        },
        this.lazyRoute('home', 'домашняя', () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent)),
        this.lazyRoute('unknown', '**', () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent))
    ];
}
