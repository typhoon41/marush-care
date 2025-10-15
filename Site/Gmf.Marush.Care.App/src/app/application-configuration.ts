import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';
import { RoutingDefinition } from './routes';
import { error } from './shared/interceptors/error';
import { language } from './shared/interceptors/language';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([language, error])),
    provideZonelessChangeDetection(),
    provideRouter(new RoutingDefinition().routes, withInMemoryScrolling(scrollConfig)),
    provideClientHydration(withEventReplay(), withIncrementalHydration())]
};
