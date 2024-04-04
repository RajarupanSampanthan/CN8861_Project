import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeConfigurationComponent } from './node-configuration.component';

describe('NodeConfigurationComponent', () => {
  let component: NodeConfigurationComponent;
  let fixture: ComponentFixture<NodeConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
