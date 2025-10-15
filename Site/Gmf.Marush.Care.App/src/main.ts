
/// <reference types="@angular/localize" />
import { bootstrapApplication } from '@angular/platform-browser';
import { Application } from './app/application';
import { appConfig } from './app/application-configuration';

bootstrapApplication(Application, appConfig)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
