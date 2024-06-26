import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchpadComponent } from './sketchpad.component';

describe('SketchpadComponent', () => {
  let component: SketchpadComponent;
  let fixture: ComponentFixture<SketchpadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketchpadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SketchpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
