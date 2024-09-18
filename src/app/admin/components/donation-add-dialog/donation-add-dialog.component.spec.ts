import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationAddDialogComponent } from './donation-add-dialog.component';

describe('DonationAddDialogComponent', () => {
  let component: DonationAddDialogComponent;
  let fixture: ComponentFixture<DonationAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonationAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
