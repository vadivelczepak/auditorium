import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddbookingPage } from './addbooking.page';

describe('AddbookingPage', () => {
  let component: AddbookingPage;
  let fixture: ComponentFixture<AddbookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
