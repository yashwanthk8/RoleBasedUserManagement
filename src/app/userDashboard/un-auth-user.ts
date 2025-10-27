
import { Component, inject, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-un-auth-user',
  imports: [CommonModule,FormsModule],
  templateUrl: './un-auth-user.html',
  styleUrl: './un-auth-user.css'
})
export class UnAuthUser {
mockList: any[] = [];
  loading = true;
  isAdmin = false;
  currentUserRole = '';
  currentUserName='';
  editingUser: any = null;

  http = inject(HttpClient);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.currentUserRole = localStorage.getItem('userRole') || '';
      this.isAdmin = this.currentUserRole === 'admin';

      console.log('Current User Role:', this.currentUserRole);
      console.log('Is Admin:', this.isAdmin);
      // alert('You do not have permission to EDIT or DELETE users');
      // if (!token) {
      //   alert('You must be logged in to view this page.');
      //   this.router.navigate(['/login']);
      //   return;
      // }
    }

    this.getMockApi();
  }

  getMockApi() {
    console.log('Fetching users...');
    this.loading = true;
    this.http.get<any[]>("https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users")
      .subscribe({
        next: (res: any) => {
          console.log('API response:', res);
          this.mockList = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching user list:', err);
          this.loading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          console.log('Request completed');
        }
      });
  }

  editUser(user: any) {
    if (!this.isAdmin) {
      alert('Only administrators can edit users');
      return;
    }
    console.log('Editing user:', user);

    // Create a copy of the user to edit
    this.editingUser = { ...user };
  }

  saveUser() {
    if (!this.editingUser) return;

    console.log('Saving user:', this.editingUser);

    this.http.put(`https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users/${this.editingUser.id}`, this.editingUser)
      .subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          alert('User updated successfully');
          this.editingUser = null;
          this.getMockApi(); // Refresh the list
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Failed to update user');
        }
      });
  }

  cancelEdit() {
    this.editingUser = null;
  }

  deleteUser(userId: string) {
    if (!this.isAdmin) {
      alert('Only administrators can delete users');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users/${userId}`)
        .subscribe({
          next: () => {
            alert('User deleted successfully');
            this.getMockApi(); // Refresh the list
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
          }
        });
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
    }
    this.router.navigate(['/login']);
  }
}
