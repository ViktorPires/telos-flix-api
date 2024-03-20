const { Router } = require("express");

const commentsController = require("../controllers/comments.controller");

const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const { verifyAuthorization } = require("../middlewares/verifyAuthorization");

const routes = Router();

routes.get("/comments", verifyAuthenticate, verifyAuthorization, commentsController.list);
routes.get("/comments/movie/:movie_id", commentsController.listCommentsByMovie);
routes.get("/comments/:id", commentsController.getById);

routes.post("/comments/movie/:movie_id", verifyAuthenticate, commentsController.create);

routes.put("/comments/:id", verifyAuthenticate, commentsController.update);

routes.delete("/comments/:id", verifyAuthenticate, verifyAuthorization, commentsController.remove);

module.exports = routes;