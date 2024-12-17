import { RenderMode, ServerRoute } from '@angular/ssr';
import { RoutingDefinition } from './app.routes';

const routingDefinition = new RoutingDefinition();
const serverSideRoute = (key: string) => {
    const route = routingDefinition.translateRoute(key);
    return route.substring(1);
};

export const serverRoutes: ServerRoute[] = [
    {
        path: serverSideRoute('client-notified'),
        renderMode: RenderMode.Prerender
    },
    {
        path: serverSideRoute('request-sent'),
        renderMode: RenderMode.Prerender
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
