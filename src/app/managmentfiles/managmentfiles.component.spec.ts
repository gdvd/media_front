import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentfilesComponent } from './managmentfiles.component';

describe('ManagmentfilesComponent', () => {
  let component: ManagmentfilesComponent;
  let fixture: ComponentFixture<ManagmentfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagmentfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagmentfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
