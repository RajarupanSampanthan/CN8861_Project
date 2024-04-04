import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-network-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-configuration.component.html',
  styleUrl: './network-configuration.component.css'
})
export class NetworkConfigurationComponent implements OnChanges {

  @Output() 
  networkBlockUpdate = new EventEmitter<String>();

  @Input()
  componentIsActive : Boolean = true


  currentNetworkBlock : String = "172.22.0.0/16"

  
  ngOnChanges(changes: SimpleChanges): void {

    console.log("IN Network Config window chnages")
    console.log(changes)

  }

  
  OnConfirmNetworkAddressBlock(networkBlock : string){
    console.log("User confirmed Network Block!")

    var stringSplit = networkBlock.split("/")
    var mask = parseInt(stringSplit[1])

    if(mask < 32 && mask >= 0 && (mask & 1) == 0){
      this.currentNetworkBlock = networkBlock
      this.networkBlockUpdate.emit(this.currentNetworkBlock);
    }
    else{
      console.log("Inocrrect value. WIll not assign IP addresses")
    }
  }


  GetFixedPartOfIPAddress() : String {
    var dotSplit = this.currentNetworkBlock.split(".")
    var firstHalf = dotSplit[0].concat(".",dotSplit[1],".")
    return firstHalf
  }

}






