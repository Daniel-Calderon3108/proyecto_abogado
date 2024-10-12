import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLawyerComponent } from './form-lawyer.component';

describe('FormLawyerComponent', () => {
  let component: FormLawyerComponent;
  let fixture: ComponentFixture<FormLawyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormLawyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
