import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
export class UserAddDialogComponent {
  authorities: string[] = ['RESPONSIBLE', 'DOCTOR', 'DONOR'];
  userAdd = {
    cin: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    roles: [],
    authorities: [],
  };

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

    console.log(
      password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')
    );
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  submit(): void {
    if (
      this.userAdd.cin &&
      this.userAdd.firstname &&
      this.userAdd.lastname &&
      this.userAdd.email &&
      this.userAdd.roles.length > 0
    ) {
      const userData: UserAdd = {
        cin: this.userAdd.cin,
        firstname: this.userAdd.firstname,
        lastname: this.userAdd.lastname,
        email: this.userAdd.email,
        password: this.generatePassword(),
        roles: this.userAdd.roles,
      };

      this.dialogRef.close(userData);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
