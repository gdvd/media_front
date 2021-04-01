import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemmiComponent } from './typemmi.component';

describe('TypemmiComponent', () => {
  let component: TypemmiComponent;
  let fixture: ComponentFixture<TypemmiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypemmiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypemmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
