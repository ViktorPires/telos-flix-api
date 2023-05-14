const { Router } = require("express");

const usersController = require("../controllers/users.controller");
const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const { verifyAuthorization } = require("../middlewares/verifyAuthorization");

const routes = Router();

routes.get("/users", usersController.list);

routes.post("/users", usersController.create);

routes.post("/users/createAdmin", verifyAuthenticate, verifyAuthorization, usersController.createAdminUsers)

routes.get("/users/:id", usersController.getById);

routes.put("/users/:id", usersController.update);

routes.delete("/users/:id", usersController.remove);

module.exports = routes;
