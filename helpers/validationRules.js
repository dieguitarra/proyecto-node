const validator = require("express-validator");
const { body, validationResult } = validator;
//este es el middleware con las reglas de validación
const validationRules = [
  body("name")
    .notEmpty()
    .withMessage("Campo obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("min 2,max 30"),
  body("lastName")
    .notEmpty()
    .withMessage("Campo obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("min 2,max 30"),
  body("email")
    .notEmpty()
    .withMessage("Campo obligatorio")
    .isEmail()
    .withMessage("Debe ingresar un  email válido"),
  body("message")
    .notEmpty()
    .withMessage("")
    .trim(" ")
    .withMessage("Debe contener entre 10 y 300 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formData = req.body;
      const arrWarnings = errors.array();

      res.render("registerForm", { arrWarnings, formData });
    } else return next();
  },
];
module.exports = validationRules;
