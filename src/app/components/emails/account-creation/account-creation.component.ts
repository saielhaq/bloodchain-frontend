import { Component } from '@angular/core';

@Component({
  selector: 'app-account-creation',
  standalone: true,
  imports: [],
  templateUrl: './account-creation.component.html',
  styleUrl: './account-creation.component.scss',
})
export class AccountCreationComponent {
  name: string = 'User';
}
