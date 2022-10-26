//Middleware para renderizar la sessión secreta, solo usuarios logeados
const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else res.redirect("/noAuth");
};
module.exports = auth;
