import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-validate-confirmationn-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './validate-confirmationn-dialog.component.html',
  styleUrl: './validate-confirmationn-dialog.component.scss',
})
export class ValidateConfirmationnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ValidateConfirmationnDialogComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
