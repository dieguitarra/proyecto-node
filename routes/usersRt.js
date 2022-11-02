const express = require("express");
const router = require("express").Router();
const users = require("../controllers/usersCt");
const auth = require("../helpers/auth");

const validationRules = require("../helpers/validationRules");

router.get("/login", users.getLoginForm);
router.post("/login", users.sendLoginForm);

router.get("/register", users.getRegisterForm);
router.post("/register", users.sendRegisterForm);

router.get("/contacto", users.getContactForm);
router.post("/contacto", validationRules, users.postContactForm);

router.get("/logout", users.logout);
router.get("/settings", auth, users.getSettings);
router.post("/settings", auth, users.sendSettings);
router.get("/validate", auth, users.validateEmail);
router.get("/delete", auth, users.deleteUser);
module.exports = router;
