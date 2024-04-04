

def createLoginResponse(didSucceed):
    response = {"didSucceed": didSucceed}
    return response


def createProjectResponse(didSucceed, projects):
    response = {"didSucceed": didSucceed, "projects": projects}
    return response


def createTopologyResponse(didSucceed, topology):
    response = {"didSucceed": didSucceed, "topology": topology}
    return response


def createOspfConfigurationResponse(didSucceed, message, newConfiguration):
    response = {"didSucceed": didSucceed, "message": message,
                "configuration": newConfiguration}
    print(response)
    return response
