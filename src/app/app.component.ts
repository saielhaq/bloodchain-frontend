import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideHotToastConfig } from '@ngneat/hot-toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
