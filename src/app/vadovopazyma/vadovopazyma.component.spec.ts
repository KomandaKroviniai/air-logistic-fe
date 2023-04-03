import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VadovopazymaComponent } from './vadovopazyma.component';

describe('VadovopazymaComponent', () => {
  let component: VadovopazymaComponent;
  let fixture: ComponentFixture<VadovopazymaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VadovopazymaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VadovopazymaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
