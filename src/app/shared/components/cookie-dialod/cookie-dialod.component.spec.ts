import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieDialodComponent } from './cookie-dialod.component';

describe('CookieDialodComponent', () => {
  let component: CookieDialodComponent;
  let fixture: ComponentFixture<CookieDialodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookieDialodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieDialodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
