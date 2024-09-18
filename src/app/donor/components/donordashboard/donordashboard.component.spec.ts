import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonordashboardComponent } from './donordashboard.component';

describe('DonordashboardComponent', () => {
  let component: DonordashboardComponent;
  let fixture: ComponentFixture<DonordashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonordashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
