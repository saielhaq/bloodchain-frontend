import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmationn-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './delete-confirmationn-dialog.component.html',
  styleUrl: './delete-confirmationn-dialog.component.scss',
})
export class DeleteConfirmationnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationnDialogComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
