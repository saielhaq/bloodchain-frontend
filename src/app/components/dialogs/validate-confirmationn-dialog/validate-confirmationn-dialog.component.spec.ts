import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateConfirmationnDialogComponent } from './validate-confirmationn-dialog.component';

describe('ValidateConfirmationnDialogComponent', () => {
  let component: ValidateConfirmationnDialogComponent;
  let fixture: ComponentFixture<ValidateConfirmationnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateConfirmationnDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateConfirmationnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
