import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSelectionDialogComponent } from './role-selection-dialog.component';

describe('RoleSelectionDialogComponent', () => {
  let component: RoleSelectionDialogComponent;
  let fixture: ComponentFixture<RoleSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSelectionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
