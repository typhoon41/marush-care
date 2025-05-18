import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@shared/services/authentication-service';

export const adminGuard = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
  const authenticationService = inject(AuthenticationService);

    if (!authenticationService.isAuthenticated()) {
        return true;
    }

    const router = inject(Router);
    return router.parseUrl('admin/klijenti');
};
