from misc import numToIpString
from connection import *
from graph import *

DISTANCE_INDEX = 0
NODE_INDEX = 1
AREA_CROSS_INDEX = 2


def setOspfConfiguration(topology, settings):

    nodes = topology["nodes"]
    links = topology["links"]
    nodeToLinkIndices, linkToLinkGraph = createLinkToLinkGraph(links)
    linkSettings = settings["linkConfigs"]

    is_contiguous, linksGroupedByArea = areasAreContiguous(
        linkSettings, linkToLinkGraph)

    if not is_contiguous:
        print("Areas are not contiguous")
        return

    if 0 not in linksGroupedByArea:
        print("Area 0 not present")
        return

    print("Areas are contiguous")
    print(nodeToLinkIndices)

    canReachArea0, abrs = getABRS(
        nodeToLinkIndices, links, linkSettings, linksGroupedByArea)

    print(abrs)

    canConfigure = False

    if canReachArea0:
        canConfigure = True
        nodeSettings = settings["nodeConfigs"]

        ospfNodeConfigData = getNodeConfigArray(
            nodes, links, linkSettings, nodeSettings, abrs)

        for nodeIndex, configData in enumerate(ospfNodeConfigData):

            print("Generating for node index ", nodeIndex)
            commands = generatingCMlCommandsForNode(configData)

            print(configData)
            print("\n\n\nThis is config commands for node ", nodeIndex)
            print("Commands are: ")

            for line in commands:
                print(line)

            connectionHandler = getNodeConnectionHandler(
                nodeSettings[nodeIndex])

            if connectionHandler != None:
                connectionHandler.enable()
                output = connectionHandler.send_config_set(
                    commands)

            else:
                print("COnnection Handler is zero")

    return canConfigure, "This is a dummy message", "This is a dummy conf"


def areasAreContiguous(linkSettings, linkToLinkGraph):
    contiguousAreas = {}
    linksSeen = set()

    for linkIndex, linkSetting in enumerate(linkSettings):

        if linkIndex not in linksSeen:
            currentArea = linkSetting["ospfArea"]

            if currentArea not in contiguousAreas:
                linksInArea = []
                queue = [linkIndex]
                while len(queue) > 0:
                    linkToProcess = queue.pop()

                    if linkToProcess not in linksSeen:
                        linksSeen.add(linkToProcess)
                        linksInArea.append(linkToProcess)
                        for adjacentLink in linkToLinkGraph[linkToProcess]:
                            if linkSettings[adjacentLink]["ospfArea"] == currentArea and linkSettings[adjacentLink]['isUp']:
                                queue.append(adjacentLink)

                contiguousAreas[currentArea] = linksInArea

            else:
                return False, {}

    return True, contiguousAreas


def getNodeConfigArray(nodes, links, linkSettings, nodeSettings, abrs):
    nodeConfigArray = []

    for nodeIndex, ni in enumerate(nodes):
        nodeConfigData = getInitialNodeOSPFConfigData(
            nodeSettings[nodeIndex]["name"],
            nodeIndex + 1,
            ni["adapterToPortNames"]
        )

        nodeConfigArray.append(nodeConfigData)

    for linkIndex, link in enumerate(links):
        for f in ["A", "B"]:
            nodeFieldName = "node" + f + "Index"
            adapterFieldName = "adapter" + f + "Index"
            portFieldName = "port" + f + "Index"
            ipFieldName = "node" + f + "IpAddress"
            linkNodeIndex = link[nodeFieldName]
            linkPortIndex = link[portFieldName]
            linkAdapterIndex = link[adapterFieldName]

            specificPort = nodeConfigArray[linkNodeIndex]["adapterToPorts"][linkAdapterIndex][linkPortIndex]
            specificPort["isUp"] = linkSettings[linkIndex]["isUp"]
            specificPort["ospfArea"] = linkSettings[linkIndex]["ospfArea"]
            specificPort["ipAddress"] = linkSettings[linkIndex][ipFieldName]

    ABR_INDEX = 0
    TRANSIT_AREA_INDEX = 1

    for area, bArray in abrs.items():
        transitArea = bArray[TRANSIT_AREA_INDEX]
        print(area)
        if area != 0 and transitArea != 0:
            abrAIndex = bArray[ABR_INDEX]
            abrBIndex = abrs[transitArea][ABR_INDEX]
            abrSum = abrAIndex + abrBIndex
            for index in [abrAIndex, abrBIndex]:
                vr = getInitialVirtualLink()
                vr["otherRouterId"] = nodeConfigArray[abrSum - index]["routerId"]
                vr["transitArea"] = transitArea
                nodeConfigArray[index]["virtual"].append(vr)

    return nodeConfigArray


def getInitialNodeOSPFConfigData(hostname, routerIdNum, adapterToPortsDict):
    adapterDict = {}
    for adapterIndex, adapter in adapterToPortsDict.items():
        print("Processsing for adapter index " + str(adapterIndex))
        portArray = []
        for portName in adapter:
            portConfigData = getInitialPortConfigData()
            portConfigData["portName"] = portName
            portArray.append(portConfigData)

        print(portArray)
        print("\n\n\n")
        adapterDict[int(adapterIndex)] = portArray

    print(adapterDict)
    print("\n\n\n")

    adapterDict[adapterIndex] = portArray

    return {
        "hostname":  hostname,
        "routerId": numToIpString(routerIdNum, 4),
        "adapterToPorts": adapterDict,
        "virtual": []
    }


def getInitialVirtualLink():
    return {
        "otherRouterId": 0,
        "transitArea": 0
    }


def getInitialPortConfigData():
    return {
        "ospfArea": 0,
        "portName": None,
        "ipAddress": None,
        "isUp": True
    }


def getOtherNode(link, nodeIndex):
    if nodeIndex == link["nodeAIndex"]:
        return link["nodeBIndex"]

    return link["nodeAIndex"]


def getABRS(nodeToLinkIndices, links, linkSettings, linksGroupedByArea):

    areaToNodes = getAreaToNodeIndices(links, linkSettings)

    canReachArea0, minDistances = getMinDistancesFromArea0(
        links, linkSettings, linksGroupedByArea, nodeToLinkIndices)

    abrs = {}

    if canReachArea0:

        for area, nodeList in areaToNodes.items():
            minNode = nodeList.pop()
            for nodeIndex in nodeList:
                if minDistances[nodeIndex][DISTANCE_INDEX] < minDistances[minNode][DISTANCE_INDEX]:
                    minNode = nodeIndex

            abrs[area] = [minNode, minDistances[minNode][AREA_CROSS_INDEX]]

    return canReachArea0, abrs


def getMinDistancesFromArea0(links, linkSettings, linksGroupedByArea, nodeToLinkIndices):

    firstNode = links[linksGroupedByArea[0][0]]["nodeAIndex"]
    minDistances = [None] * len(nodeToLinkIndices)

    queue = PriorityQueue()
    queue.put([0, firstNode, 0])

    while not queue.empty():
        values = queue.get()
        nodeIndex = values[NODE_INDEX]
        accepted = False

        if minDistances[nodeIndex] == None:
            minDistances[nodeIndex] = values
            accepted = True
        elif minDistances[nodeIndex][DISTANCE_INDEX] > values[DISTANCE_INDEX]:
            minDistances[nodeIndex] = values
            accepted = True

        if accepted:

            for linkIndex in nodeToLinkIndices[nodeIndex]:
                linkSetting = linkSettings[linkIndex]
                if linkSetting['isUp']:
                    distance = values[DISTANCE_INDEX]
                    area_cross = values[AREA_CROSS_INDEX]

                    if linkSetting["ospfArea"] != 0:
                        distance += 1

                    area_cross = linkSetting["ospfArea"]
                    other_node = getOtherNode(links[linkIndex], nodeIndex)
                    new_value = [distance, other_node, area_cross]
                    queue.put(new_value)

    return None not in minDistances, minDistances


def generatingCMlCommandsForNode(nodeConfigInfo):

    commands = ["configure terminal",
                "hostname " + nodeConfigInfo["hostname"]]

    for adapterIndex, adapter in nodeConfigInfo["adapterToPorts"].items():
        print(adapter)
        for port in adapter:
            print("Printing port")
            print(port)
            if port["ipAddress"] != None:
                commands.append("int " + port["portName"])
                commands.append(
                    "ip address " + port["ipAddress"] + " 255.255.255.252")
                commands.append("shutdown")
                if port["isUp"]:
                    commands.append("no shutdown")

    commands.append("exit")
    commands.append("no router ospf 1")
    commands.append("router ospf 1")
    commands.append("router-id " + nodeConfigInfo["routerId"])

    for adapterIndex, adapter in nodeConfigInfo["adapterToPorts"].items():
        for port in adapter:
            if port["ipAddress"] != None:
                commands.append(
                    "network " + port["ipAddress"] + " 0.0.0.0 area " + str(port["ospfArea"]))

    for abrValue in nodeConfigInfo["virtual"]:
        command = "area " + \
            str(abrValue["transitArea"]) + \
            " virtual-link " + abrValue["otherRouterId"]
        commands.append(command)

    commands.append("exit")
    commands.append("exit")

    return commands
