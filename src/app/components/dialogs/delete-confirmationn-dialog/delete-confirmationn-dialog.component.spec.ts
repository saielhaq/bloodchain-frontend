import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationnDialogComponent } from './delete-confirmationn-dialog.component';

describe('DeleteConfirmationnDialogComponent', () => {
  let component: DeleteConfirmationnDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationnDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteConfirmationnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
