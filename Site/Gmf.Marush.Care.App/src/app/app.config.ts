import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RoutingDefinition } from './app.routes';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { languageInterceptor } from './shared/interceptors/language.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([languageInterceptor, errorInterceptor])),
    provideRouter(new RoutingDefinition().routes),
    provideClientHydration()]
};
