import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  userInitial: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Subscribe to auth status changes
      this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });

      this.authService.userName$.subscribe(userName => {
        this.userName = userName;
        this.userInitial = userName ? userName.charAt(0).toUpperCase() : '';
      });

      // Initial check
      this.authService.updateAuthStatus();
    }
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
