class InvalidRatingException extends Error {
    constructor(message) {
      super(message || "Invalid rating value. Must be an integer between 1 and 5");
      this.name = "InvalidRatingException";
      this.statusCode = 400;
    }
  }
  
  module.exports = {
    InvalidRatingException,
  };