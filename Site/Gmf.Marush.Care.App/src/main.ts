import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@env';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import Language from './app/shared/models/language.model';
import '@angular/localize/init';

const language = new Language();

if (environment.name === 'development' || language.isPredefined()) {
  bootstrapApplication(AppComponent, appConfig)
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
}

else {
  language.changeTo(language.default);
}
