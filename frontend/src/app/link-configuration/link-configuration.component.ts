import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LinkInfo, NodeInfo, Topology } from '../models/TopologyModels';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-link-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-configuration.component.html',
  styleUrl: './link-configuration.component.css'
})
export class LinkConfigurationComponent  implements OnChanges {


  @Input()
  selectedLinkId!: number;

  @Input()
  componentIsActive : Boolean = true

  @Input()
  topology! : Topology

  @Input()
  networkBlockIpAddress! : String

  linkConfigForm : FormArray<FormGroup> =  new FormArray<FormGroup>([]) 

  linkStates : Boolean[] = []
  nodeAIsHigher : Boolean[] = []
  nodeAIpAddresses : String[] = []
  nodeBIpAddresses : String[] = []
  ospfArea : Number[] = []
  subnets : String[] = []

  subnetSet : Record<string, Number> = {}


  constructor(private fb: FormBuilder) {}


  get Links() : FormArray<FormGroup> {
    return this.linkConfigForm;
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.log("IN Link Config window chnages")
    console.log(changes)
    
    if(changes['topology'] !== undefined){
      if(changes['topology'].currentValue !== undefined ){
        this.topology = changes['topology'].currentValue
        this.CreateLinkForm()
      }
    }

    if(changes['networkBlockIpAddress'] !== undefined){
      if(changes['networkBlockIpAddress'].currentValue !== undefined ){
        this.networkBlockIpAddress = changes['networkBlockIpAddress'].currentValue
        console.log("Reassigning Ip Addresses for ", this.networkBlockIpAddress)
        this.OnConfirmNetworkAddressBlock(this.networkBlockIpAddress)
      }
    }

    if(changes['selectedLinkId'] !== undefined){
      if(changes['selectedLinkId'].currentValue !== undefined ){
        this.selectedLinkId = changes['selectedLinkId'].currentValue
        console.log("Selected Link Id is ", this.selectedLinkId)
      }
    }

  }


  CreateLinkForm(){
    this.linkConfigForm.clear()
    this.topology.links.forEach(
      (li : LinkInfo) =>  {
        this.linkConfigForm.push(this.CreateLinkFormGroup())
        this.linkStates.push(true)
        this.nodeAIsHigher.push(true)
        this.nodeAIpAddresses.push("0.0.0.0")
        this.nodeBIpAddresses.push("0.0.0.0")
        this.ospfArea.push(0)
      }
    );
  }

  CreateLinkFormGroup(): FormGroup {
    return this.fb.group({
      "isUp" : new FormControl<Boolean>(true),
      "nodeAIpAddress" : new FormControl<String>(""),
      "nodeBIpAddress" : new FormControl<String>(""),
      "ospfArea" : new FormControl<Number>(0),
    });
  }

  OnConfirmNetworkAddressBlock(networkBlock : String){
    console.log("User confirmed Network Block!")

    var stringSplit = networkBlock.split("/")
    var mask = parseInt(stringSplit[1])

    if(mask < 32 && mask >= 0 && (mask & 1) == 0){

      var dotSplit = networkBlock.split(".")
      var firstHalf = dotSplit[0].concat(".",dotSplit[1],".")
      var count = 0

      for (let i = 0; i < this.linkConfigForm.controls.length; i++) {
        this.AssignIpAddressToSubnet(i, firstHalf, count)
        count += 4
      }
    }
    else{
      console.log("Inocrrect value. WIll not assign IP addresses")
    }
  }

  AssignIpAddressToSubnet(i : number, firstHalf : string, count: number){
    this.subnets[i] = firstHalf + this.numToRouterString(count,2)

    var lowerIpAddress : string = firstHalf + this.numToRouterString(count + 1,2)
    var higherIpAddress : string = firstHalf + this.numToRouterString(count + 2,2)
    if ( this.nodeAIsHigher[i]){
      this.linkConfigForm.controls[i].get("nodeAIpAddress")?.setValue(higherIpAddress)
      this.linkConfigForm.controls[i].get("nodeBIpAddress")?.setValue(lowerIpAddress)
    }
    else{
      this.linkConfigForm.controls[i].get("nodeAIpAddress")?.setValue(lowerIpAddress)
      this.linkConfigForm.controls[i].get("nodeBIpAddress")?.setValue(higherIpAddress)
    }

    this.nodeAIpAddresses[i] = this.linkConfigForm.controls[i].get("nodeAIpAddress")?.value
    this.nodeBIpAddresses[i] = this.linkConfigForm.controls[i].get("nodeBIpAddress")?.value
  }

  numToRouterString(num : number, iterations: number) : String {

    var s : String = ""

    for (let i  =0 ; i < iterations;  i ++){
      var masked : number =  num & 255
      s =  "." +  masked.toString() + s
      num = num >> 8
    }

    return s.substring(1)
  }

  OnToggleLinkState(){
    console.log(this.linkStates)
    var newState  : Boolean = !this.linkStates[this.selectedLinkId]
    this.linkConfigForm.controls[this.selectedLinkId].get("isUp")?.setValue(newState)
    this.linkStates[this.selectedLinkId] = newState
    console.log(this.linkConfigForm)
  }


  OnSwitchPortIpAddresses(){
    var nodeAIpAddress : String =  this.linkConfigForm.controls[this.selectedLinkId].get("nodeAIpAddress")?.value
    this.linkConfigForm.controls[this.selectedLinkId].get("nodeAIpAddress")?.setValue(this.linkConfigForm.controls[this.selectedLinkId].get("nodeBIpAddress")?.value)
    this.linkConfigForm.controls[this.selectedLinkId].get("nodeBIpAddress")?.setValue(nodeAIpAddress)
    this.nodeAIpAddresses[this.selectedLinkId] = this.linkConfigForm.controls[this.selectedLinkId].get("nodeAIpAddress")?.value
    this.nodeBIpAddresses[this.selectedLinkId] = this.linkConfigForm.controls[this.selectedLinkId].get("nodeBIpAddress")?.value
  }


  OnConfirmLinkConfigs(selectedSubnet : String, selectedOspfArea : String){
    console.log("Onconfirm link config")
    console.log(selectedSubnet)
    console.log(selectedOspfArea)

    var dotSplit = selectedSubnet.split(".")
    var count = parseInt(dotSplit[2]) * 256  + parseInt(dotSplit[3])
    var firstHalf = dotSplit[0].concat(".",dotSplit[1],".")

    this.AssignIpAddressToSubnet(this.selectedLinkId, firstHalf, count)
    this.linkConfigForm.controls[this.selectedLinkId].get("ospfArea")?.setValue(parseInt(selectedOspfArea as string))
    this.ospfArea[this.selectedLinkId] = parseInt(selectedOspfArea as string)
  }



}
