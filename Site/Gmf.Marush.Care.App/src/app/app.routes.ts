import { BaseRoutingDefinition, TranslatedRoute } from './shared/models/routing.model';

export class RoutingDefinition extends BaseRoutingDefinition {
    override routes: TranslatedRoute[] = [
        {
            key: 'default',
            path: '',
            pathMatch: 'full',
            redirectTo: 'početna'
        },
        this.lazyRoute('home', 'početna', () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent)),
        this.lazyRoute('unknown', '**', () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent))
    ];
}
