import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import Language from '../models/language.model';

export const languageInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authReq = request.clone({
        headers: request.headers.set('Accept-Language', new Language().predefined().value)
    });

    return next(authReq);
};
