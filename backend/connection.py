import netmiko


def getRouterConnectionHandlers(nodes):
    ch = []

    for index, node in enumerate(nodes):
        print(node)
        try:
            cisco_device = {
                'device_type': 'cisco_ios_telnet',
                'host': node["ipAddress"],    # IP address of your Cisco router
                'username': node['username'],  # Your SSH username
                'password': node['password'],  # Your SSH password
                'port': node["port"],
                'secret': node['secret'],
            }

            print("Cisco device is ", cisco_device)
            ch.append(netmiko.ConnectHandler(
                **cisco_device))

        except Exception as e:
            ch.append(None)
            print(e)

    return ch


def getNodeConnectionHandler(node):
    try:
        cisco_device = {
            'device_type': 'cisco_ios_telnet',
            'host': node["ipAddress"],    # IP address of your Cisco router
            'username': node['username'],  # Your SSH username
            'password': node['password'],  # Your SSH password
            'port': node["port"],
            'secret': node['secret'],
        }

        print("Cisco device is ", cisco_device)
        return netmiko.ConnectHandler(
            **cisco_device)

    except Exception as e:
        print(e)

    return None
