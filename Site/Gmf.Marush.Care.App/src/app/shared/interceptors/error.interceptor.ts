import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@shared/services/authentication-service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { Observable, catchError, finalize } from 'rxjs';
import { RoutingDefinition } from 'src/app/app.routes';

export const errorInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const router = inject(Router);
    const loader = inject(GlobalLoaderService);
    const authenticationService = inject(AuthenticationService);
    loader.startLoading();
    return next(request).pipe(finalize(() => loader.stopLoading()),
        catchError(async(error: HttpErrorResponse) => {
            if (error.status === HttpStatusCode.Unauthorized) {
                authenticationService.logout();
            }

            else if (error.status === HttpStatusCode.InternalServerError) {
                await router.navigate([new RoutingDefinition().error($localize`:@@routes.error.system:sistemska`)]);
            }

            return error as unknown as HttpEvent<unknown>;
        })
       );
};
