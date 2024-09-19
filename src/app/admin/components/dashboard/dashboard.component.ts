import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { DonationService } from '../../../services/donation.service';
import { Donation, DonationAdd } from '../../../models/donation.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { DonationAddDialogComponent } from '../donation-add-dialog/donation-add-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { ValidateConfirmationnDialogComponent } from '../../../components/dialogs/validate-confirmationn-dialog/validate-confirmationn-dialog.component';
import { DeleteConfirmationnDialogComponent } from '../../../components/dialogs/delete-confirmationn-dialog/delete-confirmationn-dialog.component';
import { EmailService } from '../../../services/email.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class DashboardComponent implements OnInit {
  delete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  displayedColumns: string[] = [
    'donationType',
    'quantity',
    'donationDate',
    'donationStatus',
    'userCin',
  ];
  dataSource = new MatTableDataSource<Donation>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private donationService: DonationService,
    private router: Router,
    private location: Location,
    private toast: HotToastService,
    private dialog: MatDialog,
    private emailService: EmailService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.verifyUserRole();
  }

  verifyUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token).authorities;
      if (!decodedToken.includes('ADMIN')) {
        this.location.back();
      } else {
        this.loadDonationData();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadDonationData() {
    this.donationService.getAll().subscribe((data) => {
      this.dataSource.data = data
        .filter((donation) => donation.donationDate)
        .sort((a, b) => {
          return (
            new Date(b.donationDate!).getTime() -
            new Date(a.donationDate!).getTime()
          );
        });
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue || '').trim().toLowerCase();
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  editDonation(id: number) {
    this.donationService.getById(id).subscribe(
      (data) => {
        const dialogRef = this.dialog.open(DonationAddDialogComponent, {
          width: '400px',
          data: {
            donationType: data.donationType,
            quantity: data.quantity,
            userCin: data.userCin,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            const updatedDonation: Donation = {
              id: id,
              donationType: result.type,
              quantity: result.quantity,
              donationDate: data.donationDate,
              donationStatus: data.donationStatus,
              userCin: result.userCin,
            };
            this.donationService.edit(updatedDonation).subscribe(
              () => {
                this.loadDonationData();
                this.toast.success('Donation updated successfully');
              },
              (error) => {
                this.toast.error("Couldn't update donation");
                console.error('Error updating donation', error);
              }
            );
          }
        });
      },
      (error) => {
        this.toast.error("Couldn't fetch donation data");
        console.error('Error fetching donation data', error);
      }
    );
  }

  openDonationPopup() {
    const dialogRef = this.dialog.open(DonationAddDialogComponent, {
      width: '400px',
      data: { category: '', amount: 0, userCin: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.donationService.addDonation(result).subscribe(
          (data) => {
            this.dataSource.data = [data as Donation, ...this.dataSource.data];
            this.toast.success('Donation added successfully');
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }

  deleteDonation(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationnDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.donationService.delete(id).subscribe(() => {
          this.loadDonationData();
        });
      }
    });
  }
  validateDonation(id: number) {
    const dialogRef = this.dialog.open(ValidateConfirmationnDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.donationService.validate(id).subscribe((result) => {
          this.loadDonationData();
          if (result.userCin) {
            this.userService.findByCin(result.userCin).subscribe((user) => {
              if (user) {
                this.emailService
                  .sendDonationValidationEmail({
                    to: user.email,
                    name: user.firstname,
                  })
                  .subscribe(
                    () => {
                      this.toast.success('Validation email sent successfully');
                    },
                    (error) => {
                      this.toast.error("Couldn't send validation email");
                      console.error('Error sending validation email', error);
                    }
                  );
              } else {
                this.toast.error('User not found');
                console.error('User not found for ID:', id);
              }
            });
          }
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
