import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddDialogComponent } from './user-add-dialog.component';

describe('UserAddDialogComponent', () => {
  let component: UserAddDialogComponent;
  let fixture: ComponentFixture<UserAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
