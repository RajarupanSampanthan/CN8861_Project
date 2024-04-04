import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NodeInfo, Topology } from '../models/TopologyModels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-node-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './node-configuration.component.html',
  styleUrl: './node-configuration.component.css'
})
export class NodeConfigurationComponent implements OnChanges {

  @Input()
  selectedNodeId : Number = 0

  @Input()
  componentIsActive : Boolean = true

  @Input()
  topology! : Topology
  
  nodeConfigForm : FormGroup = this.fb.group({
    nodes : new FormArray<FormGroup>([]) 
  }); 
  


  constructor(private fb: FormBuilder) {}


  get Nodes() : FormArray{
    return this.nodeConfigForm.controls["nodes"] as FormArray
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.log("IN Link Config window chnages")
    console.log(changes)
    
    if(changes['topology'] !== undefined){
      if(changes['topology'].currentValue !== undefined ){
        this.topology = changes['topology'].currentValue
        this.CreateNodeConfigForm()
      }
    }

  }

  CreateNodeConfigForm(){
    var count = 1 
    this.topology.nodes.forEach(
      (ni : NodeInfo) => {
        var routerId = this.numToRouterString(count,4)
        this.Nodes.push(this.createNodeFormGroup(ni.name, routerId ))
        count += 1
      }
    );
    console.log(this.nodeConfigForm)
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

  numToRouterString(num : number, iterations: number) : String {
    var s : String = ""

    for (let i  =0 ; i < iterations;  i ++){
      var masked : number =  num & 255
      s =  "." +  masked.toString() + s
      num = num >> 8
    }
    return s.substring(1)
  }

}
