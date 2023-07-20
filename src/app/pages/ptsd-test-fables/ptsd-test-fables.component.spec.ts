import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestFablesComponent } from './ptsd-test-fables.component';

describe('PtsdTestFablesComponent', () => {
  let component: PtsdTestFablesComponent;
  let fixture: ComponentFixture<PtsdTestFablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestFablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestFablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
