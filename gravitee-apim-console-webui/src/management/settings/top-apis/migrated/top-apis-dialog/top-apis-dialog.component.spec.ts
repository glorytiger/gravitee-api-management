import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopApisDialogComponent } from './top-apis-dialog.component';

describe('TopApisDialogComponent', () => {
  let component: TopApisDialogComponent;
  let fixture: ComponentFixture<TopApisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopApisDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopApisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
