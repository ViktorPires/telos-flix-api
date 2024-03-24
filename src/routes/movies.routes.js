const { Router } = require("express");

const moviesController = require("../controllers/movies.controller");

const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const { verifyAuthorization } = require("../middlewares/verifyAuthorization");
const { verifyIfUserHasAuthentication } = require("../middlewares/verifyIfUserHasAuthentication")

const routes = Router();

routes.get("/movies/", verifyIfUserHasAuthentication, moviesController.list);
routes.get("/movies/free", moviesController.listFreeMovies);
routes.get("/movies/genres", moviesController.listGenres);
routes.get("/movies/:id", verifyIfUserHasAuthentication, moviesController.getById);

routes.post("/movies", verifyAuthenticate, verifyAuthorization, moviesController.create);

routes.put("/movies/:id", verifyAuthenticate, verifyAuthorization, moviesController.update);

routes.delete("/movies/:id", verifyAuthenticate, verifyAuthorization, moviesController.remove);

module.exports = routes;
