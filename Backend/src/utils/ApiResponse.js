class ApiResponse{
    constructor(
        statusCode, data, message= "Success"
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = 200 <= statusCode && statusCode < 300;
    }
}

export {ApiResponse}