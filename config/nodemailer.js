const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  authorization: {
    user: process.env.user,
    pass: process.env.pass,
  },
});
module.exports = transport;
