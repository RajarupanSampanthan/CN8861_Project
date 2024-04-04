import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkConfigurationComponent } from './link-configuration.component';

describe('LinkConfigurationComponent', () => {
  let component: LinkConfigurationComponent;
  let fixture: ComponentFixture<LinkConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
