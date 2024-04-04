
export {
    LoginRequest,
    LoginResponse
}

class LoginResponse{
    didSucceed : boolean = false;
}

class LoginRequest{
    username : string = "";
    password : string = "";
}