import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsuperadminComponent } from './dashboardsuperadmin.component';

describe('DashboardsuperadminComponent', () => {
  let component: DashboardsuperadminComponent;
  let fixture: ComponentFixture<DashboardsuperadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardsuperadminComponent]
    });
    fixture = TestBed.createComponent(DashboardsuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
