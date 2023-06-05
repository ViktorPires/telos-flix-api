const jwtService = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyIfUserHasAuthentication = (request, response, next) => {
  const { authorization } = request.headers;

  if (authorization) {
    const [prefix, token] = authorization.split(" ");

    if (prefix === "Bearer" && token) {
      jwtService.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.log("error: @authenticate/invalid-token");
          console.log("Token provided is invalid");
          
          request.user = null;
          return next();
        }
        request.user = decoded;
        return next();
      })
    } else {
      request.user = null;
      return next();
    }
  } else {
    request.user = null;
    return next();
  }
}

module.exports = { verifyIfUserHasAuthentication }