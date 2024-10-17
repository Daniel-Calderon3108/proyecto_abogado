import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCaseProcessComponent } from './form-case-process.component';

describe('FormCaseProcessComponent', () => {
  let component: FormCaseProcessComponent;
  let fixture: ComponentFixture<FormCaseProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCaseProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCaseProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
