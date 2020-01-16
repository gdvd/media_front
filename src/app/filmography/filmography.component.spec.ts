import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmographyComponent } from './filmography.component';

describe('FilmographyComponent', () => {
  let component: FilmographyComponent;
  let fixture: ComponentFixture<FilmographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilmographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
