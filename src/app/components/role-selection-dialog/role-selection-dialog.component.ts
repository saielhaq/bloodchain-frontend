import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role-selection-dialog',
  standalone: true,
  imports: [MatDialogModule, MatListModule, CommonModule, MatButtonModule],
  templateUrl: './role-selection-dialog.component.html',
  styleUrls: ['./role-selection-dialog.component.scss'],
})
export class RoleSelectionDialogComponent {
  roles: string[];

  constructor(
    public dialogRef: MatDialogRef<RoleSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roles: string[] }
  ) {
    this.roles = this.data.roles.sort((a, b) => a.localeCompare(b));
  }

  selectRole(role: string) {
    this.dialogRef.close(role);
  }

  close() {
    this.dialogRef.close();
  }
}
