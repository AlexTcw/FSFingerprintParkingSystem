import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    return true;
  } else {
    return router.createUrlTree(['/home']);  // Redirige al usuario si no hay usuario en localstorage
  }
};
