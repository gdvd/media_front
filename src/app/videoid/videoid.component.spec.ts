import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoidComponent } from './videoid.component';

describe('VideoidComponent', () => {
  let component: VideoidComponent;
  let fixture: ComponentFixture<VideoidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
