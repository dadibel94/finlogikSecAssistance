import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToututulisateursComponent } from './toututulisateurs.component';

describe('ToututulisateursComponent', () => {
  let component: ToututulisateursComponent;
  let fixture: ComponentFixture<ToututulisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToututulisateursComponent]
    });
    fixture = TestBed.createComponent(ToututulisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
