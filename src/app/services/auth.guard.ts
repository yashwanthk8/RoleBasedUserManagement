import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Please login to access this page');
      router.navigate(['/login']);
      return false;
    }
    return true;
  }
  return true;
};
