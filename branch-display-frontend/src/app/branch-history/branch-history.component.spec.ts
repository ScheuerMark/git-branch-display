import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchHistoryComponent } from './branch-history.component';

describe('BranchHistoryComponent', () => {
  let component: BranchHistoryComponent;
  let fixture: ComponentFixture<BranchHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
