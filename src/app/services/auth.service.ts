import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userNameSubject = new BehaviorSubject<string>('');

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    }
  }

  private checkAuthStatus() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const userName = localStorage.getItem('userName');

      this.isLoggedInSubject.next(!!token);
      this.userNameSubject.next(userName || '');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      this.isLoggedInSubject.next(false);
      this.userNameSubject.next('');
    }
  }

  updateAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    }
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.clear();
      this.isLoggedInSubject.next(false);
      this.userNameSubject.next('');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
