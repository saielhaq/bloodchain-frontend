import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationValidationComponent } from './donation-validation.component';

describe('DonationValidationComponent', () => {
  let component: DonationValidationComponent;
  let fixture: ComponentFixture<DonationValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonationValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
