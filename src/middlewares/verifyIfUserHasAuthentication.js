const jwtService = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyIfUserHasAuthentication = (request, response, next) => {
  const { authorization } = request.headers;

  if (authorization) {
    const [prefix, token] = authorization.split(" ");

    if (prefix === "Bearer" && token) {
      jwtService.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          return response.status(401).json({
            error: "@authenticate/invalid-token",
            message: "Token provided is invalid",
          });
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