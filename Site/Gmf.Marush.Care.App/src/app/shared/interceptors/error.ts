import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '@shared/services/authentication';
import { GlobalLoader } from '@shared/services/global-loader';
import { Observable, catchError, finalize } from 'rxjs';
import { RoutingDefinition } from 'src/app/routes';

export const error = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const router = inject(Router);
    const loader = inject(GlobalLoader);
    const authentication = inject(Authentication);
    loader.startLoading();
    return next(request).pipe(finalize(() => loader.stopLoading()),
        catchError(async(errorFound: HttpErrorResponse) => {
            if (errorFound.status === HttpStatusCode.Unauthorized) {
                authentication.logout();
                await router.navigate([new RoutingDefinition().error($localize`:@@routes.error.unauthorized:nemate-pristup`)]);
            }

            else if (errorFound.status !== HttpStatusCode.BadRequest) {
                await router.navigate([new RoutingDefinition().error($localize`:@@routes.error.system:sistemska`)]);
            }

            return errorFound as unknown as HttpEvent<unknown>;
        })
       );
};
