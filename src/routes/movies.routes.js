const { Router } = require("express");

const moviesController = require("../controllers/movies.controller");

const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const { verifyAuthorization } = require("../middlewares/verifyAuthorization");

const routes = Router();

routes.get("/movies/page/:page", moviesController.list);
routes.get("/movies/genres", moviesController.listGenres);
routes.get("/movies/:id", moviesController.getById);

routes.post("/movies", verifyAuthenticate, verifyAuthorization, moviesController.create);

routes.put("/movies/:id", moviesController.update);

routes.delete("/movies/:id", verifyAuthenticate, verifyAuthorization, moviesController.remove);

module.exports = routes;
