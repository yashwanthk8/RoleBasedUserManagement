import AOS from 'aos';
import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterOutlet,RouterLink],
  templateUrl:'./register.html'
})
export class Register {
  ngOnInit(){
   
    AOS.init();
  }
  registerForm: FormGroup;

  private apiUrl = 'https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users';
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post(this.apiUrl, this.registerForm.value).subscribe({
        next: (res) => {
          alert('Registration successful!');
          this.registerForm.reset();
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Something went wrong!');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
