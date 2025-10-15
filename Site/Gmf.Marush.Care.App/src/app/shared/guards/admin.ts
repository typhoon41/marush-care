import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Authentication } from '@shared/services/authentication';

export const isAdmin = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
  const authenticationService = inject(Authentication);

    if (!authenticationService.isAuthenticated()) {
        return true;
    }

    const router = inject(Router);
    return router.parseUrl('admin/klijenti');
};
