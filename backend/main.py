
import json
from netmiko import ConnectHandler
from flask import Flask, request
from flask_cors import CORS
from gns3 import *

from misc import getArgDict
from response import *
from ospf import *
# example gns3 command to get info
# curl -u "admin:admin" -i -X GET "http://localhost:3080/v2/projects/17e26056-9035-42cf-9fc6-05cfc04235f2/nodes"
# curl -u "admin:admin" -i -X GET "http://localhost:3080//v2/compute/projects/17e26056-9035-42cf-9fc6-05cfc04235f2/cloud/nodes/46117e31-06c7-41ab-8b50-36c4b854fffa"

# https://gns3-server.readthedocs.io/en/latest/api/v2/controller/server/version.html

# Run with this flask --app main run --port 3000
# sngular ng serve --proxy-config ./config/proxy.config.json

# nvm install --latest-npm

app = Flask(__name__)
CORS(app)


@app.route("/api/login")
def login():
    arg_dict = getArgDict(request)
    did_succeed = getVersion(arg_dict['username'], arg_dict["password"])
    return createLoginResponse(did_succeed)


@app.route("/api/projects")
def listProjects():
    arg_dict = getArgDict(request)
    did_succeed, returnObject = getProjects(
        arg_dict['username'], arg_dict["password"])
    return createProjectResponse(did_succeed, returnObject)


@app.route("/api/topology")
def getTopology():
    arg_dict = getArgDict(request)
    print("Recieved ", arg_dict)
    print(arg_dict)
    success, return_object = getTopologyInfo(
        arg_dict['username'], arg_dict["password"], arg_dict["projectId"])
    return createTopologyResponse(success, return_object)


@app.route("/api/ospf", methods=['POST'])
def configureOspf():
    arg_dict = request.json
    topology = arg_dict["topology"]
    configuration = arg_dict["configuration"]
    success, message, config = setOspfConfiguration(
        topology, configuration)
    return createOspfConfigurationResponse(success, message, config)


# if __name__ == "__main__":

#     did_succeed = False
#     # Define the device to connect to
#     cisco_device = {
#         'device_type': 'cisco_ios_telnet',
#         'host': '127.0.0.1',    # IP address of your Cisco router
#         'username': 'R1',  # Your SSH username
#         'password': 'R1',  # Your SSH password
#         'port': 5000,                  # Optional: SSH port (default is 22)
#         # Optional: Enable secret (if required)
#         'secret': 'R1',
#     }

#     # Create a connection handler
#     net_connect = ConnectHandler(**cisco_device)

#     # Enter enable mode if required
#     net_connect.enable()

#     # Send command to display interface information and store output
#     output = net_connect.send_command('show ip interface brief')

#     # Print the output
#     print(output)

#     # Close the connection
#     net_connect.disconnect()
