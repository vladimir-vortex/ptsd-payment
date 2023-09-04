import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtsdTestLusherStartComponent } from './ptsd-test-lusher-start.component';

describe('PtsdTestLusherStartComponent', () => {
  let component: PtsdTestLusherStartComponent;
  let fixture: ComponentFixture<PtsdTestLusherStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtsdTestLusherStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtsdTestLusherStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
