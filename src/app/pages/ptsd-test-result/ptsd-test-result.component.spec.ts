import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestResultComponent } from './ptsd-test-result.component';

describe('PtsdTestResultComponent', () => {
  let component: PtsdTestResultComponent;
  let fixture: ComponentFixture<PtsdTestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
