import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { NodeInfo, Topology } from '../models/TopologyModels';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SketchpadComponent } from '../sketchpad/sketchpad.component';
import { ConfigPanelComponent } from '../config-panel/config-panel.component';
import { LinkInfo } from '../models/TopologyModels';
@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [SketchpadComponent, ConfigPanelComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css'
})
export class ProjectPageComponent implements AfterViewInit  {

  @ViewChild('canvas')
  canvas!: SketchpadComponent; 

  @ViewChild('configPanel')
  configPanel!: ConfigPanelComponent; 

  projectId: string = ""
  topology! : Topology;
  selectedLinkId : number = 0
  selectedNodeId : number = 0

  public configStage = new BehaviorSubject({
    width: 200,
    height: 200
  });

  constructor(private backendService : BackendService, private route: ActivatedRoute) {}





  ngOnInit() {
    this.route.params.subscribe(
      params => {
       this.projectId = params['projectId'];
       console.log("Project is  is ", this.projectId)
    },
    error => {
      console.log("Error")

    });
  }


  ngAfterViewInit(): void {
    this.backendService.GetTopologyRequest(this.projectId).subscribe(
      response => {
        console.log(response)
        console.log("FIrst Topology")   
        this.topology = response.topology!
        this.loader()
        
        console.log("Loader")
      },
      error => {
        console.log("Error")
      }
     );
  }

  lerp(start : number, end : number, ratio : number){
    return start + ratio * (end - start)
  }



  loader(){
    this.canvas.deleteCanvas()
    this.canvas.generateCanvas()
    console.log("Second topology")
    var max_x = 0
    var max_y = 0
    var min_x = 0
    var min_y = 0
    
    this.topology.nodes.forEach(
      (ni : NodeInfo)  => {
        max_x = Math.max(max_x, ni.position.x)
        max_y = Math.max(max_y, ni.position.y)
        min_x = Math.min(min_x, ni.position.x)
        min_y = Math.min(min_y, ni.position.y)
      }
    );

    var x_diff = max_x - min_x
    var y_diff = max_y - min_y
   

    for (let i = 0; i < this.topology.links.length; i++) {
      var li : LinkInfo = this.topology.links[i]
      var na : NodeInfo = this.topology.nodes[li.nodeAIndex]
      var nb : NodeInfo = this.topology.nodes[li.nodeBIndex]
      var scaledAX =   this.lerp(0.1, 0.9, (na.position.x - min_x) / x_diff)
      var scaledAY = this.lerp(0.1, 0.9, (na.position.y - min_y) / y_diff) 
      var scaledBX =   this.lerp(0.1, 0.9, (nb.position.x - min_x) / x_diff)
      var scaledBY = this.lerp(0.1, 0.9, (nb.position.y - min_y) / y_diff) 

      this.canvas?.drawLine(scaledAX, scaledAY, scaledBX, scaledBY).on("click", () => {
        console.log("Node A ", this.topology.links[i].nodeAIndex, " to Node B ", this.topology.links[i].nodeBIndex);
        this.selectedLinkId = i
      });
    }

    for (let i = 0; i < this.topology.nodes.length; i++) {
      var ni : NodeInfo = this.topology.nodes[i]
        var scaledX =   this.lerp(0.1, 0.9, (ni.position.x - min_x) / x_diff)
        var scaledY = this.lerp(0.1, 0.9, (ni.position.y - min_y) / y_diff) 

        this.canvas?.drawCircle(scaledX, scaledY, ni.name ).on("click", () => {
          console.log(ni.nodeId)
          console.log(this.selectedNodeId)
          this.selectedNodeId = i
        });
    }
    
  }
}
