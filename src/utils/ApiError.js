class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        // override
          super(message)
          this.statusCode = statusCode
          this.data = null
          // this.message = false,
          this.errors = errors

          // to trace stack
          if(stack){
            this.stack = stack
          }else{
            Error.captureStackTrace(this,this.constructor)
          }
    }
}

export {ApiError}