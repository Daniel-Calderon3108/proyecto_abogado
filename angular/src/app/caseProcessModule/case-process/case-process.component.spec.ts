import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseProcessComponent } from './case-process.component';

describe('CaseProcessComponent', () => {
  let component: CaseProcessComponent;
  let fixture: ComponentFixture<CaseProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
