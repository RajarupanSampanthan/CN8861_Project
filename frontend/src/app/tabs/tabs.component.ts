import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})

export class TabsComponent implements OnInit, AfterContentInit {

  @Input()
  options!: String[];

  @Output() tabSelected = new EventEmitter<number>();
  
  isActive : boolean[] = []

  ngOnInit() {
    this.isActive = []
    for (let i = 1; i <= this.options.length; i++) {
      this.isActive.push(false)
      this.isActive[0] = true
  }
  }
  
  // contentChildren are set
  ngAfterContentInit() {
  }
  
  selectTab(tabIndex: number){
    this.tabSelected.emit(tabIndex)
  }
}
