import { RoutingDefinition } from 'src/app/app.routes';

export class BaseRoutingComponent {
    readonly translateRoute = (key: string) => new RoutingDefinition().translateRoute(key);
}
