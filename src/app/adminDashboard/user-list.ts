
import { Component, inject, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../services/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
  providers: [User]
})
export class UserList implements OnInit {
  mockList: any[] = [];
  loading = true;
  isAdmin = false;
  currentUserRole = '';
  currentUserName = '';
  editingUser: any = null;
  userForm: FormGroup;
  submitted = false;

  userService = inject(User);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });
  }

  GotoDetails(userId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.isAdmin) {
      alert('Only administrators can view user details');
      return;
    }
    this.router.navigate(['/user-details', userId]);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.currentUserRole = localStorage.getItem('userRole') || '';
      this.currentUserName = localStorage.getItem('userName') || '';
      this.isAdmin = this.currentUserRole === 'admin';
    }

    this.getMockApi();
  }



  getMockApi() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.mockList = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user list:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editUser(user: any) {
    if (!this.isAdmin) {
      alert('Access Denied: You do not have permission to edit users');
      return;
    }
    this.editingUser = { ...user };
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    if (!this.editingUser) return;

    const updatedUser = {
      ...this.editingUser,
      ...this.userForm.value
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        alert('User updated successfully');
        this.editingUser = null;
        this.submitted = false;
        this.userForm.reset();
        this.getMockApi();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user');
      }
    });
  }

  cancelEdit() {
    this.editingUser = null;
    this.submitted = false;
    this.userForm.reset();
  }

  // Getter for easy form field access in template
  get f() {
    return this.userForm.controls;
  }

  deleteUser(userId: string) {
    if (!this.isAdmin) {
      alert('Access Denied: You do not have permission to delete users');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.getMockApi();
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
