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

@Component({
  selector: 'app-donation-add-dialog',
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
  providers: [DonationService],
  templateUrl: './donation-add-dialog.component.html',
  styleUrls: ['./donation-add-dialog.component.scss'],
})
export class DonationAddDialogComponent implements OnInit {
  types: string[] = ['BLOOD', 'REDCELLS', 'WHITECELLS', 'PLASMA'];
  quantity: number = 0;
  userCinControl = new FormControl('');
  quantityError: string = '';
  typeError: string = '';
  userCinError: string = '';

  usersCin: string[] = [];
  filteredUsersCin: Observable<string[]> = new Observable<string[]>();

  constructor(
    public dialogRef: MatDialogRef<DonationAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private donationService: DonationService,
    private userService: UserService,
    private toast: HotToastService
  ) {}

  ngOnInit() {
    this.getUsersCin();

    if (this.data) {
      this.quantity = this.data.quantity || 0;
      this.userCinControl.setValue(this.data.userCin || '');
    }

    this.filteredUsersCin = this.userCinControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usersCin.filter((cin) =>
      cin.toLowerCase().includes(filterValue)
    );
  }

  submit() {
    this.quantityError = '';
    this.typeError = '';
    this.userCinError = '';

    const isEdit = !!this.data.donationType;

    if (!isEdit && !this.data.category) {
      this.typeError = 'Donation type must be selected';
      this.toast.warning('Please select a donation type');
      return;
    }

    if (this.quantity < 100) {
      this.quantityError = 'Quantity must be at least 100';
      this.toast.warning('The quantity must be at least 100');
      return;
    }

    if (!this.userCinControl.value) {
      this.userCinError = 'User CIN cannot be blank';
      this.toast.warning('User CIN cannot be blank');
      return;
    }

    if (!this.usersCin.includes(this.userCinControl.value)) {
      this.userCinError = 'User CIN must be among the listed users';
      this.toast.warning('User CIN must be among the listed users');
      return;
    }

    const donationData: DonationAdd = {
      type: this.data.category || this.data.donationType,
      quantity: this.quantity,
      userCin: this.userCinControl.value,
    };

    this.dialogRef.close(donationData);
  }

  getUsersCin() {
    this.userService.findAll().subscribe((data) => {
      this.usersCin = data.map((user) => user.cin);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
