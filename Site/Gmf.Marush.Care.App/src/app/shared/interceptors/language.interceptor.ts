/* eslint-disable @stylistic/max-len */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable func-style */
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function languageInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authReq = request.clone({
        headers: request.headers.set('Accept-Language', 'sr')
    });

    return next(authReq);
}
