class UserAlreadyCommentedException extends Error {
    constructor(message) {
      super(message || "User has already commented on this movie");
      this.name = "UserAlreadyCommentedException";
      this.statusCode = 400;
    }
  }
  
  module.exports = {
    UserAlreadyCommentedException,
  };