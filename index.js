require("./config/mongo");
const path = require("path");
const { log } = require("console");
const express = require("express");
const hbs = require("express-handlebars");
const usersRoute = require("./routes/usersRoute");
const session = require("express-session");
const { create } = require("handlebars");

const authorization = require("./helpers/authorization");

//Aplicación express
const app = express();
//Inicio de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
//Configuración de Express-handlebars
app.engine("hbs", hbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

//Carga los archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, "/public")));

//Para habilitar la lectura de datos del body de la rquest
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

app.get("/secret", authorization, (req, res) => {
  res.render("secret", {
    user: `${req.session.user.name} ${req.session.user.lastName}`,
    id: req.session.user.id,
  });
});
const handle = create({ helpers: require("./helpers/filtro") });
//Rutas
app.use("/", usersRoute);
app.get("/noauthorization", (req, res) => {
  res.render("noAuthorization");
});

//Puerto de escucha del servidor
app.listen(3000, (err) => {
  !err ? log("server running on http://localhost:3000") : log("error 404");
});
