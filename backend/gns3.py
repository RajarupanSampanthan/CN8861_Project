import requests

gns3Url = "http://localhost:3080/v2"


def getVersion(username, password) -> bool:
    auth = (username, password)
    url = gns3Url + "/projects"
    if requests.get(url, auth=auth).status_code == 200:
        return True

    return False


def getProjects(username, password):
    url = gns3Url + "/projects"
    auth = (username, password)

    response = requests.get(url, auth=auth)
    if response.status_code == 200:
        returnProjects = []
        for projectResponse in response.json():
            project = {
                "fileName": projectResponse["filename"],
                "projectId": projectResponse["project_id"]
            }
            returnProjects.append(project)

        return True, returnProjects

    return False, []


def getTopologyInfo(username, password, project_id):
    nodesUrl = gns3Url + "/projects/" + project_id + "/nodes"
    linksUrl = gns3Url + "/projects/" + project_id + "/links"
    auth = (username, password)

    nodes_response = requests.get(nodesUrl, auth=auth)
    links_response = requests.get(linksUrl, auth=auth)
    success: bool = nodes_response.status_code == 200 and links_response.status_code == 200

    return_object = {
        "nodes": [],
        "links": []
    }

    if success:
        nodes = []
        nodeIdToIndex = {}
        for nodeIndex, nodeData in enumerate(nodes_response.json()):
            print("Porcessing node with name ", nodeData["name"])
            print(nodeData)
            print("\n\n\n")
            node_info = {
                "nodeId": nodeData["node_id"],
                "name": nodeData["name"],
                "adapterToPortNames": getAdapaterPortArray(nodeData["ports"]),
                "position": {
                    "x": nodeData["x"],
                    "y": nodeData["y"]
                }
            }
            nodeIdToIndex[nodeData["node_id"]] = nodeIndex
            nodes.append(node_info)

        return_object["nodes"] = nodes

        links = []
        for linkData in links_response.json():
            print("Porcessing link")
            print(linkData)
            print("\n\n\n")
            nodeA = linkData["nodes"][0]
            nodeB = linkData["nodes"][1]
            link_info = {
                "nodeAIndex": nodeIdToIndex[nodeA["node_id"]],
                "adapterAIndex": nodeA["adapter_number"],
                "portAIndex": nodeA["port_number"],
                "nodeBIndex": nodeIdToIndex[nodeB["node_id"]],
                "adapterBIndex": nodeB["adapter_number"],
                "portBIndex": nodeB["port_number"],
            }
            links.append(link_info)

        return_object["links"] = links

    return success, return_object


def getAdapaterPortArray(portsSection):

    adapterDict = {}

    for port in portsSection:
        adapterNum = port["adapter_number"]
        shortName = port["short_name"]

        if adapterNum not in adapterDict:
            adapterDict[adapterNum] = [shortName]

        else:
            adapterDict[adapterNum].append(shortName)

    return adapterDict
