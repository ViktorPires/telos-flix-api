const { Router } = require("express");

const errorsController = require("../controllers/errors.controller");

const routes = Router();

routes.post("/errors", errorsController.createError);

module.exports = routes;