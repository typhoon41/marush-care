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
        renderMode: RenderMode.Prerender
    },
    {
        path: serverSideRoute('request-sent'),
        renderMode: RenderMode.Prerender
    },
    {
        path: serverSideRoute('home'),
        renderMode: RenderMode.Server
    },
    {
        path: serverSideRoute('appointment'),
        renderMode: RenderMode.Server
    },
    {
        path: serverSideRoute('contact'),
        renderMode: RenderMode.Server
    },
    {
        path: serverSideRoute('services'),
        renderMode: RenderMode.Server
    },
    {
        path: '**',
        renderMode: RenderMode.Client
    }
];
