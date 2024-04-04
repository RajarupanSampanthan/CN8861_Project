import { Topology } from "./TopologyModels";


export {
    OspfConfigurationResponse,
    OspfConfiguration,
    NodeSettings,
    LinkSettings
}



interface OspfConfigurationResponse{
    didSucceed : Boolean 
    message : String 
}

class OspfConfiguration{
    settings! : {
        networkConfigs : string
        linkConfigs : LinkSettings[]
        nodeConfigs : NodeSettings[]
    }
}

class NodeSettings {
      ipAddress : String = ""
      port : Number = 0
      username : String = ""
      password : String = ""
      secret : String = ""
      name : String= ""
      routerId : String = ""
  }

class LinkSettings {
    subnet : String = ""
    ospfArea : Number = 0
    isActive : Boolean = true
    ipIncrease : Boolean = true
}
