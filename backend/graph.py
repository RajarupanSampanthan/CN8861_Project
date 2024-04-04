from queue import PriorityQueue


def getAreaToNodeIndices(links, linkSettings):
    areaToNodeIndices = {}

    for linkIndex, link in enumerate(links):
        area = linkSettings[linkIndex]["ospfArea"]
        for linkKey in ["nodeAIndex", "nodeBIndex"]:
            nodeId = link[linkKey]

            if area not in areaToNodeIndices:
                areaToNodeIndices[area] = set({nodeId})
            else:
                areaToNodeIndices[area].add(nodeId)

    return areaToNodeIndices


def getNodeToLinkIndices(links):
    nodeToLinkIndices = {}

    for linkIndex, link in enumerate(links):
        for linkKey in ["nodeAIndex", "nodeBIndex"]:
            nodeId = link[linkKey]

            if nodeId not in nodeToLinkIndices:
                nodeToLinkIndices[nodeId] = [linkIndex]
            else:
                nodeToLinkIndices[nodeId].append(linkIndex)

    return nodeToLinkIndices


def createLinkToLinkGraph(links):

    linkToLinkGraph = []
    nodeToLinkIndices = getNodeToLinkIndices(links)

    for linkIndex, link in enumerate(links):
        adjacentLinks = []
        for linkKey in ["nodeAIndex", "nodeBIndex"]:
            nodeId = link[linkKey]
            for adjacentLinkIndex in nodeToLinkIndices[nodeId]:

                if adjacentLinkIndex != linkIndex:
                    adjacentLinks.append(adjacentLinkIndex)

        linkToLinkGraph.append(adjacentLinks)

    return nodeToLinkIndices, linkToLinkGraph
