
import { mergeApplicationConfig, ApplicationConfig, InjectionToken,
   inject, RESPONSE_INIT, LOCALE_ID, REQUEST } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

export const SERVER_RESPONSE = new InjectionToken<ResponseInit>('SERVER_RESPONSE');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const request = inject(REQUEST);
        const match = request?.url.match(/\/(sr|en|ru)\//u);
        return match ? match[1] : 'sr';
      }
    },
    provideServerRouting(serverRoutes),
    {
      provide: SERVER_RESPONSE,
      useFactory: () => inject(RESPONSE_INIT, { optional: true })
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
