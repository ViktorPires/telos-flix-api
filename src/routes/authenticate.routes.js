const { Router } = require("express");

const authenticateController = require("../controllers/authenticate.controller");
const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const { verify } = require("jsonwebtoken");

const routes = Router();

routes.post("/authenticate", authenticateController.login);

routes.get('/check-token', verifyAuthenticate, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

module.exports = routes;
