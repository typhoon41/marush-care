import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import '@angular/localize/init';

bootstrapApplication(AppComponent, appConfig)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
