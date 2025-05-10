import { Route } from '@angular/router';

export interface TranslatedRoute extends Route {
    key: string;
    isProtected?: boolean;
}
