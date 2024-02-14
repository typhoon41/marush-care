import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';
import { RoutingDefinition } from './app.routes';

const serverConfig: ApplicationConfig = {
  providers: [
    provideRouter(new RoutingDefinition().routes),
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
