import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoInputComponent } from './repo-input.component';

describe('RepoInputComponent', () => {
  let component: RepoInputComponent;
  let fixture: ComponentFixture<RepoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepoInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
