class ErrorRes {
  constructor(message) {
    this.error = true;
    this.message = message;
  }
}

module.exports = ErrorRes;
