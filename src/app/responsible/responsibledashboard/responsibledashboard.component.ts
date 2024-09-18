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
import { UserService } from '../../services/user.service';
import { Authority, Role, User, UserAdd } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteConfirmationnDialogComponent } from '../../components/dialogs/delete-confirmationn-dialog/delete-confirmationn-dialog.component';
import { EmailService } from '../../services/email.service';
import { MatDialogModule } from '@angular/material/dialog';
import { UserAddDialogComponent } from '../../admin/components/user-add-dialog/user-add-dialog.component';

@Component({
  selector: 'app-responsibledashboard',
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
    MatDialogModule,
  ],
  templateUrl: './responsibledashboard.component.html',
  styleUrl: './responsibledashboard.component.scss',
})
export class ResponsibledashboardComponent {
  currentUser: string = '';

  displayedColumns: string[] = [
    'fullName',
    'cin',
    'bloodType',
    'highestAuthority',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location,
    private toast: HotToastService,
    private dialog: MatDialog,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.verifyUserRole();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.currentUser = decodedToken.cin;
      console.log(decodedToken);
    }
  }

  verifyUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token).authorities;
      if (!decodedToken.includes('RESPONSIBLE')) {
        this.location.back();
      } else {
        this.loadUserData();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserData() {
    const authorityOrder = ['ADMIN', 'RESPONSIBLE', 'DOCTOR', 'DONOR'];

    this.userService.findAll().subscribe((data: any[]) => {
      data.sort((a, b) => {
        return (
          authorityOrder.indexOf(a.authorities[0]) -
          authorityOrder.indexOf(b.authorities[0])
        );
      });

      this.dataSource.data = data;
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

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationnDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.delete(id).subscribe(() => {
          this.loadUserData();
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  addUser() {
    const dialogRef = this.dialog.open(UserAddDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.userService.addUser(result).subscribe(
          (data) => {
            console.log('data', data);
            this.dataSource.data = [data, ...this.dataSource.data];
            this.toast.success('User added successfully');
            this.emailService
              .sendAccountCreationEmail({
                to: data.email,
                name: data.firstname,
                password: data.password,
              })
              .subscribe(
                (response) => {
                  console.log(response);
                  this.toast.success(
                    'Account creation email sent successfully'
                  );
                },
                (error) => {
                  this.toast.error("Couldn't send account creation email");
                  console.error('Error sending account creation email', error);
                }
              );
          },
          (error) => {
            this.toast.error('Failed to add user');
          }
        );
      }
    });
  }
}
