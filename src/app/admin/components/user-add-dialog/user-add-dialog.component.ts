import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { DonationAdd } from '../../../models/donation.model';
import { DonationService } from '../../../services/donation.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from '../../../services/user.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserAdd } from '../../../models/user.model';

@Component({
  selector: 'app-user-add-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    HttpClientModule,
    MatAutocompleteModule,
  ],
  providers: [UserService],
  templateUrl: './user-add-dialog.component.html',
  styleUrl: './user-add-dialog.component.scss',
})
export class UserAddDialogComponent implements OnInit {
  authorities: string[] = ['RESPONSIBLE', 'DOCTOR', 'DONOR'];
  userAddForm: FormGroup = new FormGroup({
    cin: new FormControl('', [Validators.required, this.cinNumberValidator]),
    firstname: new FormControl('', [Validators.required, this.nameValidator]),
    lastname: new FormControl('', [Validators.required, this.nameValidator]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.emailValidator,
    ]),
    roles: new FormControl([], [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<UserAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {}

  generatePassword(): string {
    const length = 12;
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers;

    let password = '';

    password +=
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    password +=
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = password.length; i < length; i++) {
      password +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  submit(): void {
    if (this.userAddForm.valid) {
      const userData: UserAdd = {
        cin: this.userAddForm.value.cin.trim(),
        firstname:
          this.userAddForm.value.firstname.trim().charAt(0).toUpperCase() +
          this.userAddForm.value.firstname.trim().slice(1),
        lastname:
          this.userAddForm.value.lastname.trim().charAt(0).toUpperCase() +
          this.userAddForm.value.lastname.trim().slice(1),
        email: this.userAddForm.value.email.trim(),
        password: this.generatePassword(),
        roles: this.userAddForm.value.roles,
      };
      console.log(userData);
      this.dialogRef.close(userData);
    } else {
      this.toast.error('Please fill in the required fields.');
      this.userAddForm.markAllAsTouched();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  cinNumberValidator(control: FormControl): { [key: string]: boolean } | null {
    const valid = /^[a-zA-Z0-9]*$/.test(control.value);
    return valid ? null : { invalidCinNumber: true };
  }

  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    const valid = /^[a-zA-Z\s]*$/.test(control.value);
    return valid ? null : { invalidName: true };
  }

  emailValidator(control: FormControl): { [key: string]: boolean } | null {
    const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
      control.value
    );
    return valid ? null : { invalidEmail: true };
  }

  onInput(event: any) {
    const input = event.target;
    const value = input.value ?? '';
    let validValue = value;

    if (input.getAttribute('formControlName') === 'cin') {
      validValue = value.replace(/[^a-zA-Z0-9]/g, '');
    } else if (
      input.getAttribute('formControlName') === 'firstname' ||
      input.getAttribute('formControlName') === 'lastname'
    ) {
      validValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (input.getAttribute('formControlName') === 'email') {
      validValue = value.replace(/[^a-zA-Z0-9@.]/g, '');
    }

    if (validValue !== value) {
      input.value = validValue;
      this.userAddForm
        .get(input.getAttribute('formControlName'))
        ?.setValue(validValue, { emitEvent: false });
    }
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
}
