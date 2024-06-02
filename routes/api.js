'use strict'

const express = require("express");
const { body } = require("express-validator");
var middleware = require("../middleware/middleware");
var api = express.Router();

//importo los controladores
var UsersController = require("../controllers/users");
var AuthController = require("../controllers/auth");

//Login
api.post('/login',[
  body("email").not().isEmpty(),
  body("password").not().isEmpty()
], AuthController.login_user );

api.post('/logout', middleware.userprotectUrl,  AuthController.logout);


//READE
api.get("/user", middleware.userprotectUrl, UsersController.userlist);
api.get("/user/:iduser", middleware.userprotectUrl, UsersController.userSingular);


//CREATE
api.post(
  "/", middleware.userprotectUrl,
  [
    body("iduser").not().isEmpty(),
    body("name").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").not().isEmpty()
  ],
  UsersController.createuser);

//UPDATE
api.post(
  "/user/:iduser", middleware.userprotectUrl,
  [
    body("iduser").not().isEmpty(),
    body("name").not().isEmpty(),
    body("nombre").not().isEmpty(),
    body("director").not().isEmpty(),
    body("estudio").not().isEmpty(),
    body("anio").not().isEmpty()
  ],
  UsersController.updateuser);

//DELETE
api.delete("/user/:iduser",  middleware.userprotectUrl, UsersController.deleteuser);

module.exports = api;
