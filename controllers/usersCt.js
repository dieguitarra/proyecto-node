const nodemailer = require("nodemailer");
const securePass = require("../helpers/securePass");
const User = require("../schemas/userSchema");
const transport = require("../config/mongo");

//mostrar form de login
async function getLoginForm(req, res, next) {
  res.render("loginForm");
}
//Enviamos el mail del formulario de contacto
async function validateEmail(req, res) {
  const { name, lastName, email, message } = req.body;
  const emailMsg = {
    to: "atencioncliente@nuestraempresa.com",
    from: email,
    subject: "Mensaje desde formulario de contacto",
    html: `Contacto de ${name} ${lastName}: ${message}`,
  };

  const sendMailStatus = await transport.sendMail(emailMsg);
  if (sendMailStatus.rejected.length) {
    req.app.locals.sendMailFeedback = "No pudimos enviar";
  } else {
    req.app.locals.sendMailFeedback = "Mensaje enviado";
  }
  res.redirect("/");
}
//procesar form de login
async function sendLoginForm(req, res, next) {
  const { email, pass } = req.body;
  const user = await User.find().where({ email });
  if (!user.length) {
    return res.render("loginForm", {
      message: "Usuario o contraseña incorrectos",
    });
  }

  if (await securePass.decrypt(pass, user[0].password)) {
    const usr = {
      id: user[0]._id,
      name: user[0].name,
      lastName: user[0].lastName,
    };

    req.session.user = usr;
    res.render("secret", {
      user: `${req.session.user.name}${req.session.user.lastName}`,
      id: req.session.user.id,
    });
  } else
    return res.render("loginForm", {
      message: "Usuario o contraseña incorrectos",
    });
}
function getRegisterForm(req, res, next) {
  res.render("registerForm");
}
//Procesamos el form de register ->Crear nuevo usuario
async function sendRegisterForm(req, res, next) {
  const { name, lastName, email, pass } = req.body;
  const password = await securePass.encrypt(pass);
  const newUser = new User({
    name,
    lastName,
    email,
    password,
  });
  const usr = {
    id: newUser._id,
    name: newUser.name,
    lastName: newUser.lastName,
  };
  newUser.save((err) => {
    if (!err) {
      req.session.user = usr;
      res.render("secret", {
        user: `${req.session.user.name}${req.session.user.lastName}`,
        id: req.session.user.id,
      });
    } else {
      res.render("registerForm", {
        message: "Ya existe un registro con ese email",
      });
    }
  });
}
//mostramos settings
async function getSettings(req, res) {
  const user = await User.findById(req.session.user.id).lean();
  res.render("editUserForm", { user });
}
//procesamos el form de settings
async function sendSettings(req, res) {
  try {
    await User.findByIdAndUpdate(req.session.user.id, req.body);
    res.redirect("/secret");
  } catch (error) {
    res.render("editUserForm", {
      message: "Ocurrió un error, intentá nuevamete",
    });
  }
}

//borramos un documento de la base de datos
async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.session.user.id);
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    res.render("editUserForm", {
      message: "Ocurrió un error, intentá nuevamete",
    });
  }
}
//validar el email
async function validateEmail(req, res) {
  res.send("email verification in database");
}
//logout
function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
}
module.exports = {
  getLoginForm,
  sendLoginForm,
  getRegisterForm,
  sendRegisterForm,
  getSettings,
  sendSettings,
  deleteUser,
  validateEmail,
  logout,
};
