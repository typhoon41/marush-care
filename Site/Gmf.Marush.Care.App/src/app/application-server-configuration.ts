
import {
  mergeApplicationConfig, ApplicationConfig, InjectionToken,
  inject, RESPONSE_INIT, LOCALE_ID, REQUEST
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { serverRoutes } from '@shared/routes/server-routes';
import { appConfig } from './application-configuration';

export const SERVER_RESPONSE = new InjectionToken<ResponseInit>('SERVER_RESPONSE');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const request = inject(REQUEST);
        const match = request?.url.match(/\/(sr|en|ru)\//u);
        return match ? match[1] : 'sr';
      }
    },
    {
      provide: SERVER_RESPONSE,
      useFactory: () => inject(RESPONSE_INIT, { optional: true })
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
