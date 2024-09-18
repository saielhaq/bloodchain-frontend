import { Component, ViewChild } from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-donordashboard',
  standalone: true,
  imports: [
    NavbarComponent,
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
  templateUrl: './donordashboard.component.html',
  styleUrl: './donordashboard.component.scss',
})
export class DonordashboardComponent {
  delete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  displayedColumns: string[] = [
    'donationType',
    'quantity',
    'donationDate',
    'donationStatus',
  ];
  dataSource = new MatTableDataSource<Donation>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private donationService: DonationService,
    private router: Router,
    private location: Location,
    private toast: HotToastService
  ) {}

  ngOnInit() {
    this.verifyUserRole();
  }

  verifyUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token).authorities;
      if (!decodedToken.includes('DONOR')) {
        this.location.back();
      } else {
        this.loadDonationData();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadDonationData() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      const id = decodedToken.userId;
      this.donationService.getHistory(id).subscribe((data) => {
        console.log(data);
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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
