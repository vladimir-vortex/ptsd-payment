import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestFablesStartComponent } from './ptsd-test-fables-start.component';

describe('PtsdTestFablesStartComponent', () => {
  let component: PtsdTestFablesStartComponent;
  let fixture: ComponentFixture<PtsdTestFablesStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestFablesStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestFablesStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
