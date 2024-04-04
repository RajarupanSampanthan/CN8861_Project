import { Component, OnInit } from '@angular/core';
import *  as d3 from'd3'

@Component({
  selector: 'app-sketchpad',
  standalone: true,
  imports: [],
  templateUrl: './sketchpad.component.html',
  styleUrl: './sketchpad.component.css'
})
export class SketchpadComponent implements OnInit {


  viewBoxDimensions = [0, 0, 400, 400]
  sketch : any = null 
  parentWidth = 400
  parentHeight = 400


  ngOnInit() {
    this.sketch = d3.select("#sketchpad")
    this.deleteCanvas()
    this.generateCanvas()

  }

  public generateCanvas(){




    this.sketch
    .attr('viewBox', this.viewBoxDimensions )
    .attr('svg-content-responsive',true)
    .style("width", this.parentWidth)
    .style("height", this.parentHeight);
  }

  public deleteCanvas(){
    if (this.sketch != null){
    var toRemove = this.sketch.selectAll()
      toRemove.remove()
    }
  }

  public drawCircle(x_scale: number, y_scale : number, name : string){
    return this.sketch.append('circle')
    .style("stroke", "gray")
    .style("fill", "black")
    .attr('cx',x_scale * this.parentWidth)
    .attr('cy',y_scale * this.parentHeight)
    .attr('r', 10)
    .text(name)
  }

  public drawLine(xa_scale: number, ya_scale : number, xb_scale: number, yb_scale : number){
    return this.sketch.append('line')
    .style("stroke", "black")
    .style("stroke-width", 5)
    .attr("x1", xa_scale * this.parentWidth)
    .attr("y1", ya_scale * this.parentHeight)
    .attr("x2", xb_scale * this.parentWidth)
    .attr("y2", yb_scale * this.parentHeight); 
  }

}



