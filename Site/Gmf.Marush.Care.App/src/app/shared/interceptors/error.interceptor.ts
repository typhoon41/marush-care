/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable func-style */
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { Observable, catchError, finalize } from 'rxjs';
import { RoutingDefinition } from 'src/app/app.routes';

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router = inject(Router);
    const loader = inject(GlobalLoaderService);
    loader.startLoading();
    return next(request).pipe(finalize(() => loader.stopLoading()),
        catchError(async(error: HttpErrorResponse) => {
            if (error.status === HttpStatusCode.InternalServerError) {
                await router.navigate([new RoutingDefinition().error($localize`:@@routes.error.system:sistemska`)]);
            }

            return error as unknown as HttpEvent<unknown>;
        })
       );
}
