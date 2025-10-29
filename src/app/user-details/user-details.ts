



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../services/user';
import { User1 } from '../services/auth';
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  isAdmin: boolean = false;
  usrRole: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: User,
    private cdr: ChangeDetectorRef
  ) {
    if (typeof window !== 'undefined') {
      this.isAdmin = localStorage.getItem('userRole') === 'admin';
    }
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data: any) => {
          console.log('User data received:', data); // Debug log
          this.user = data;
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection
        },
        error: (err: any) => {
          console.error('Error fetching user details:', err);
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection
          this.router.navigate(['/adminDashboard']);
        },
      });
    } else {
      console.error('No user ID provided');
      this.router.navigate(['/adminDashboard']);
    }
  }
curntUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }
 goBack(): void {
  if (this.curntUserRole()!== 'admin') {
    this.router.navigate(['/userDashboard']);
  } else {
    this.router.navigate(['/adminDashboard']);
  }
}


}
