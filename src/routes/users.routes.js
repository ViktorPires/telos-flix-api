const { Router } = require("express");

const usersController = require("../controllers/users.controller");
const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const { verifyAuthorization } = require("../middlewares/verifyAuthorization");

const routes = Router();

routes.get("/users", verifyAuthenticate, verifyAuthorization, usersController.list);

routes.post("/users", usersController.create);

routes.post("/users/createAdmin", verifyAuthenticate, verifyAuthorization, usersController.createAdminUsers)

routes.get("/users/:id", verifyAuthenticate, verifyAuthorization, usersController.getById);

routes.put("/users/:id", verifyAuthenticate, usersController.update);

routes.delete("/users/:id", verifyAuthenticate, usersController.remove);

module.exports = routes;
