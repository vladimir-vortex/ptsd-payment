import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestStartComponent } from './ptsd-test-start.component';

describe('PtsdTestStartComponent', () => {
  let component: PtsdTestStartComponent;
  let fixture: ComponentFixture<PtsdTestStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
