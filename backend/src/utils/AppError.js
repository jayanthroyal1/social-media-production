class AppError extends Error {
  constructor(message, statusCode) {
    //super(message) --> Calls the parent Error constructor.Without this, the message wouldn't be attached properly.
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // this.isOperational --> This is extremely important in production. two types
    // | Type        | Example            |
    // | ----------- | ------------------ |
    // | Operational | invalid password   |
    // | Programming | undefined variable |

    this.isOperational = true;
    // Error.captureStackTrace --> Removes unnecessary stack trace noise.Helps debugging.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
