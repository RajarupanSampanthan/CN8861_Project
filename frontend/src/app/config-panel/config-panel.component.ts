import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { CommonModule } from '@angular/common';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LinkInfo, NodeInfo, Topology } from '../models/TopologyModels';
import { BlobOptions } from 'node:buffer';
import { BackendService } from '../services/backend.service';
import { LinkConfigurationComponent } from '../link-configuration/link-configuration.component';
import { NetworkConfigurationComponent } from '../network-configuration/network-configuration.component';
import { NodeConfigurationComponent } from '../node-configuration/node-configuration.component';


@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [TabsComponent, LinkConfigurationComponent, NetworkConfigurationComponent, NodeConfigurationComponent,  CommonModule, ReactiveFormsModule],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.css'
})
export class ConfigPanelComponent implements OnChanges  {

  @Input()
  selectedNodeId!: number;

  @Input()
  selectedLinkId!: number;
  
  @Input()
  topology! : Topology;


  @ViewChild('tabs')
  tabs!: TabsComponent; 


  @ViewChild('linkConfigComponent')
  linkConfigComponent! : LinkConfigurationComponent;

  @ViewChild('networkConfigComponent')
  networkConfigComponent! : NetworkConfigurationComponent;

  @ViewChild('nodeConfigComponent')
  nodeConfigComponent! : NodeConfigurationComponent;

  currentNetworkBlock : String = "172.22.22.0/24"

  ipAddressOptionsToIndex = {}
  ipAddressOptions :String[] = []


  nodes: NodeInfo[] = [];
  links: LinkInfo[] = [];

  constructor(private fb: FormBuilder, private backendService : BackendService) {}


  configForm : FormGroup = new FormGroup({
    networkConfigs:  new FormControl<string>(''),
    linkConfigs : new FormArray([]),
    nodeConfigs : new FormArray([])
  });

  options = ["Network", "Link", "Node" ]
  isActive = [true, false, false]

  ngOnInit(): void {
    console.log("COnfig COmponenet init")
   
  }

  ngOnChanges(changes: SimpleChanges): void{
    console.log("Topology changed, IN COnfig Component")
    console.log(changes)
    if(changes['topology'] !== undefined){
      if (changes['topology'].currentValue !== undefined){
        this.topology = changes['topology'].currentValue
        this.nodes = changes['topology'].currentValue['nodes']
        this.links = changes['topology'].currentValue['links']
        this.CreateConfigForm()
      }
    }
  }

  onSave(){
    console.log(this.configForm.value)
    var returnValue = this.configForm.value
    returnValue["nodeConfigs"] = this.nodeConfigComponent.nodeConfigForm.value["nodes"]
    returnValue["linkConfigs"] = this.linkConfigComponent.linkConfigForm.value
    console.log(returnValue)
    var topology = new Topology (this.nodes, this.links)


     if (this.backendService.SendOspfConfiguration(topology, returnValue)){
      console.log("Failed")
     }

  }

  OnSelectTab(tabIndex: number){
   console.log(tabIndex, " is selected")
    for (let i = 0; i < this.isActive.length; i++) {
      this.isActive[i] = false
    }
    this.isActive[tabIndex] = true
    console.log(this.configForm)
  }



  CreateConfigForm(){
    var  fa : FormArray = this.configForm.controls['linkConfigs'] as FormArray
    this.links.forEach(
      (li : LinkInfo) =>  {
        fa.push(this.createLinkFormGroup())
      }
    );

    var  fg : FormArray= this.configForm.controls['nodeConfigs'] as FormArray
    var count = 0 
    this.nodes.forEach(
      (ni : NodeInfo) => {
        var routerId = this.numToRouterString(count,4)
        fg.push(this.createNodeFormGroup(ni.name, routerId ))
        count += 1
      }
    );
    console.log(this.configForm)
  }

  createNodeFormGroup(name : String, routerId : String ): FormGroup {
    return this.fb.group({
      "ipAddress" : new FormControl<String>(""),
      "port" : new FormControl<Number>(0),
      "username" : new FormControl<String>(""),
      "password" : new FormControl<String>(""),
      "secret" : new FormControl<String>(""),
      "name" : new FormControl<String>(name),
      "routerId" : new FormControl<String>(routerId)
    });
  }

  createLinkFormGroup(): FormGroup {
    return this.fb.group({
      "subnet" : new FormControl<String>(""),
      "isActive" : new FormControl<Boolean>(true),
      "ipIncrease" : new FormControl<Boolean>(true),
      "ospfArea" : new FormControl<Number>(0),
    });
  }

  get Links() : FormArray {
    return this.configForm.controls["linkConfigs"] as FormArray;
  }

  get Nodes() : FormArray{
    return this.configForm.controls["nodeConfigs"] as FormArray
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


  OnConfirmLinkConfigs(){
    console.log("Link COnfig is confirmed!")
  }


  OnConfirmNetworkAddressBlock(networkBlock : String){
    console.log("User confirmed Network Block!")

    var stringSplit = networkBlock.split("/")
    var mask = parseInt(stringSplit[1])

    if(mask < 32 && mask >= 0 && (mask & 1) == 0){
      this.currentNetworkBlock = networkBlock
    }
    else{
      console.log("Inocrrect value. WIll not assign IP addresses")
    }
  }



}
