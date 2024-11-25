class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ){
        // override
          super(message)
          this.statusCode = statusCode
          this.data = null
          this.message = false,
          this.errors = errors

          // to trace stack
          if(statck){
            this.stack = statck
          }else{
            Error.captureStackTrace(this,this.constructor)
          }
    }
}

export {ApiError}