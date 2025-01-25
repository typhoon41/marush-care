/* eslint-disable @typescript-eslint/no-unsafe-return */
import { mergeApplicationConfig, ApplicationConfig, InjectionToken,
   inject, RESPONSE_INIT, LOCALE_ID, REQUEST, provideEnvironmentInitializer } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

export const SERVER_RESPONSE = new InjectionToken<ResponseInit>('SERVER_RESPONSE');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const req = inject(REQUEST);
        const url = req?.url ?? '';
        const match = url.match(/^\/(sr|en|ru)/u);
        return match ? match[1] : 'sr';
      }
    },
    provideEnvironmentInitializer(() => {
      try {
        inject(REQUEST);
      } catch {
        // No-op: REQUEST is not available in browser
      }
    }),
    {
      provide: SERVER_RESPONSE,
      useFactory: () => inject(RESPONSE_INIT, { optional: true })
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
