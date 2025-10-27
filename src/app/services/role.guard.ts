
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const userRole = localStorage.getItem('userRole');

  if(userRole !== 'admin') {
    alert('Access Denied: You do not have permission to view this page');
    router.navigate(['/userDashboard']);
    return false;
  }
  
  return true;
};

