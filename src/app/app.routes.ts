import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ManageUsersComponent } from './admin/components/manage-users/manage-users.component';
import { DonordashboardComponent } from './donor/components/donordashboard/donordashboard.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DoctordashboardComponent } from './doctor/doctordashboard/doctordashboard.component';
import { ResponsibledashboardComponent } from './responsible/responsibledashboard/responsibledashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/manage-users', component: ManageUsersComponent },
  { path: 'responsible/dashboard', component: ResponsibledashboardComponent },
  { path: 'doctor/dashboard', component: DoctordashboardComponent },
  { path: 'donor/dashboard', component: DonordashboardComponent },
  { path: '**', component: NotFoundComponent },
];
