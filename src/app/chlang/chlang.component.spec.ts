import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChlangComponent } from './chlang.component';

describe('ChlangComponent', () => {
  let component: ChlangComponent;
  let fixture: ComponentFixture<ChlangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChlangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChlangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
