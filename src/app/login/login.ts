
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import AOS from 'aos';

interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginData: LoginCredentials = {
    email: '',
    password: '',
  };

  private apiUrl = 'https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init();
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (users) => {
        const foundUser = users.find(
          (u) => u.email === this.loginData.email && u.password === this.loginData.password
        );

        if (foundUser) {
          localStorage.setItem('foundUser', JSON.stringify(foundUser));
          const fakeToken = btoa(`${foundUser.email}:${foundUser.role}`);
          localStorage.setItem('authToken', fakeToken);
          localStorage.setItem('userRole', foundUser.role);
          localStorage.setItem('userName', foundUser.name);

          this.authService.updateAuthStatus(); // Update auth status

          if (foundUser.role === 'admin') {
            this.router.navigate(['/adminDashboard']);
          } else {
            this.router.navigate(['/userDashboard']);
          }
        } else {
          alert('Invalid email or password.');
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert('Something went wrong. Please try again later.');
      },
    });
  }
}
