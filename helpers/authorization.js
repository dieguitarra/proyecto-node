//Middleware para renderizar la sessión secreta, solo usuarios logeados
const authorization = (req, res, next) => {
  if (req.session.user) {
    next();
  } else res.redirect("/noAuthorization");
};
module.exports = authorization;
