import { RenderMode, ServerRoute } from '@angular/ssr';
import { RoutingDefinition } from './app.routes';

const routingDefinition = new RoutingDefinition();
const serverSideRoute = (key: string) => {
    const route = routingDefinition.translateRoute(key);
    return route.substring(1);
};

export const serverRoutes: ServerRoute[] = [
    // Following two should be Pre-Rendered but it's not working with UTF-8 characters
    {
        path: serverSideRoute('client-notified'),
        renderMode: RenderMode.Server
    },
    {
        path: serverSideRoute('request-sent'),
        renderMode: RenderMode.Server
    },
    {
        path: serverSideRoute('gallery'),
        renderMode: RenderMode.Client
    },
    {
        path: serverSideRoute('error'),
        renderMode: RenderMode.Client
    },
    {
        path: '**',
        renderMode: RenderMode.Server
    }
];
