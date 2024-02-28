import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopApisComponent } from './top-apis.component';

describe('TopApisComponent', () => {
  let component: TopApisComponent;
  let fixture: ComponentFixture<TopApisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopApisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
