import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemediaComponent } from './typemedia.component';

describe('TypemediaComponent', () => {
  let component: TypemediaComponent;
  let fixture: ComponentFixture<TypemediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypemediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypemediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
