
export{
    GetTopologyResponse,
    Topology,
    NodeInfo,
    Position,
    LinkInfo
}

class GetTopologyResponse{
    didSucceed : boolean = false;
    topology : Topology | null = null;
}


class Topology{
    nodes : NodeInfo[] = []
    links : LinkInfo[] = []

    constructor(nodes : NodeInfo[], links : LinkInfo[]){
        this.nodes = nodes
        this.links = links
    }
}

class NodeInfo {

    nodeId : string = ""
    name : string = ""
    portNames : string[] = []
    position : Position = { x : 0, y : 0}
}

class Position{
    x : number = 0
    y : number = 0
}


class LinkInfo {
        nodeAIndex: number = 0
        portAIndex : number = 0
        nodeBIndex: number = 0
        portBIndex : number = 0
}