import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { HotToastService } from '@ngneat/hot-toast';
import {
  HttpClient,
  HttpErrorResponse,
  HttpClientModule,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NavbarComponent,
    HttpClientModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({
    cinNumber: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      this.passwordStrengthValidator,
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private toast: HotToastService,
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
      this.location.back();
    }
  }

  handleSignup() {
    if (this.registrationForm.valid && this.passwordsMatch()) {
      console.log(1);
      const registrationData = {
        cin: this.registrationForm.value.cinNumber,
        firstname: this.registrationForm.value.firstName,
        lastname: this.registrationForm.value.lastName,
        email: this.registrationForm.value.userEmail,
        password: this.registrationForm.value.userPassword,
        roles: ['DONOR'],
      };

      this.http
        .post('http://localhost:8080/api/v1/auth/register', registrationData)
        .subscribe({
          next: (response: any) => {
            this.toast.success('Registration successful!');
            const token = response.token;
            localStorage.setItem('token', token);
            this.router.navigate(['/donor/dashboard']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error status:', error.status);
            console.error('Error body:', error.error);

            if (error.status === 401) {
              this.toast.error('Invalid credentials. Please try again.');
            } else {
              this.toast.error('An error occurred. Please try again later.');
            }
          },
        });
    } else {
      this.toast.error('Please fill in the required fields.');
      this.registrationForm.markAllAsTouched();
    }
  }

  passwordsMatch(): boolean {
    return (
      this.registrationForm.value.userPassword ===
      this.registrationForm.value.confirmPassword
    );
  }

  passwordStrengthValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasNumber = /[0-9]/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-]/.test(
      control.value
    );

    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      return { weakPassword: true };
    }

    return null;
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }
  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
}