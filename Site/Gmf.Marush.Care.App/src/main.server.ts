import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { Application } from './app/application';
import { config } from './app/application-server-configuration';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(Application, config, context);

export default bootstrap;
