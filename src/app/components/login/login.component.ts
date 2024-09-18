import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { RoleSelectionDialogComponent } from '../role-selection-dialog/role-selection-dialog.component';

@Component({
  selector: 'app-login',
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
    RoleSelectionDialogComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private toast: HotToastService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
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

  submit() {
    if (this.form.valid) {
      const loginData = {
        email: this.form.value.email,
        password: this.form.value.password,
      };

      this.http
        .post('http://localhost:8080/api/v1/auth/authenticate', loginData)
        .subscribe({
          next: (response: any) => {
            this.toast.success('Logged in successfully!');

            const token = response.token;
            localStorage.setItem('token', token);

            const decodedToken = this.decodeToken(token);
            const authorities = decodedToken.authorities || [];

            this.handleRoleRedirection(authorities);
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
      this.toast.error('Please fill in the required fields');
      this.form.markAllAsTouched();
    }
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  handleRoleRedirection(authorities: string[]) {
    if (authorities.length === 1) {
      this.redirectToDashboard(authorities[0]);
    } else if (authorities.length > 1) {
      const dialogRef = this.dialog.open(RoleSelectionDialogComponent, {
        data: { roles: authorities },
      });

      dialogRef.afterClosed().subscribe((selectedRole: string) => {
        if (selectedRole) {
          this.redirectToDashboard(selectedRole);
        }
      });
    }
  }

  redirectToDashboard(role: string) {
    const roles = [
      'SUPERADMIN',
      'ADMIN',
      'RESPONSIBLE',
      'DOCTOR',
      'ANALYST',
      'DONOR',
    ];
    if (roles.includes(role)) {
      this.router.navigate([`/${role.toLowerCase()}/dashboard`]);
    }
  }

  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
}
