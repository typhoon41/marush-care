import { LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';

// Mirrors application-configuration.ts: the app is zoneless and its source locale is sr.
export default [provideZonelessChangeDetection(), { provide: LOCALE_ID, useValue: 'sr' }];
