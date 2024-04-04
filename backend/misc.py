

def getArgDict(request):
    return {key: value for (key, value) in request.values.items()}


def numToIpString(value, numIndices):
    routerId = ""
    for i in range(numIndices):
        routerId = "." + str(value & 255) + routerId
        value = value >> 8

    return routerId[1:]
