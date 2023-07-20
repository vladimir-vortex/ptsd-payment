import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestLusherComponent } from './ptsd-test-lusher.component';

describe('PtsdTestLusherComponent', () => {
  let component: PtsdTestLusherComponent;
  let fixture: ComponentFixture<PtsdTestLusherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestLusherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestLusherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
