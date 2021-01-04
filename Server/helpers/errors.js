class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }

  const handleError = (err, res) => {
    let { statusCode, message } = err;
    statusCode = statusCode === undefined ? 500: statusCode;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    });
  };

  const catchAsync = (handler) => (...args) =>handler(...args).catch(args[2])

  module.exports = {
    ErrorHandler,
    handleError,
    catchAsync
  }