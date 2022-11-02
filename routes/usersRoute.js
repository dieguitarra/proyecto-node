const express = require("express");
const router = require("express").Router();
const users = require("../controllers/usersController");
const authorization = require("../helpers/authorization");

const validationRules = require("../helpers/validationRules");

router.get("/login", users.getLoginForm);
router.post("/login", users.sendLoginForm);

router.get("/register", users.getRegisterForm);
router.post("/register", users.sendRegisterForm);

router.get("/contacto", users.getContactForm);
router.post("/contacto", validationRules, users.postContactForm);

router.get("/logout", users.logout);
router.get("/settings", authorization, users.getSettings);
router.post("/settings", authorization, users.sendSettings);
router.get("/validate", authorization, users.validateEmail);
router.get("/delete", authorization, users.deleteUser);
module.exports = router;
