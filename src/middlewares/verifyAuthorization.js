const verifyAuthorization = (request, response, next) => {
  const { role } = request.user;

  if (!role) {
    return response.status(400).json({
      error: "@authorization/missing-role",
      message: "role not sent",
    });
  }

  if (role !== "admin") {
    return response.status(401).json({
      error: "@authorization/invalid-role",
      message: "role provided is not authorized",
    })
  };

  return next();
};

module.exports = {
  verifyAuthorization,
};
