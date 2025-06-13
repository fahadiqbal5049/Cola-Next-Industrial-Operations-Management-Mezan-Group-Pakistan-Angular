import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAuthorizationComponent } from './page-authorization.component';

describe('PageAuthorizationComponent', () => {
  let component: PageAuthorizationComponent;
  let fixture: ComponentFixture<PageAuthorizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageAuthorizationComponent]
    });
    fixture = TestBed.createComponent(PageAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
