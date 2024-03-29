class UserAlreadyRatedException extends Error {
    constructor(message) {
      super(message || "User has already rated this movie");
      this.name = "UserAlreadyRatedException";
      this.statusCode = 400;
    }
  }
  
  module.exports = {
    UserAlreadyRatedException,
  };