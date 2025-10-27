import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAuthUser } from './un-auth-user';

describe('UnAuthUser', () => {
  let component: UnAuthUser;
  let fixture: ComponentFixture<UnAuthUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnAuthUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnAuthUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
