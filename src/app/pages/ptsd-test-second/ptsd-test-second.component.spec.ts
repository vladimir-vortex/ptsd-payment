import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestSecondComponent } from './ptsd-test-second.component';

describe('PtsdTestSecondComponent', () => {
  let component: PtsdTestSecondComponent;
  let fixture: ComponentFixture<PtsdTestSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
