import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibledashboardComponent } from './responsibledashboard.component';

describe('ResponsibledashboardComponent', () => {
  let component: ResponsibledashboardComponent;
  let fixture: ComponentFixture<ResponsibledashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibledashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponsibledashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
