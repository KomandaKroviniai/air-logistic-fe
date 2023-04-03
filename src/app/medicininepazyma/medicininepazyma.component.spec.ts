import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicininepazymaComponent } from './medicininepazyma.component';

describe('MedicininepazymaComponent', () => {
  let component: MedicininepazymaComponent;
  let fixture: ComponentFixture<MedicininepazymaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicininepazymaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicininepazymaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
