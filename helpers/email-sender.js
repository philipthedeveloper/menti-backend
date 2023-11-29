import nodemailer from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user:
      NODE_ENV === "development" ? process.env.EMAIL : process.env.PROD_EMAIL,
    pass:
      NODE_ENV === "development"
        ? process.env.SMTPPASS
        : process.env.PROD_SMTPPASS,
  },
});

let options = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(options));

const sendEmail = async ({ email, text, data, files, template, res }) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: text,
    text: text,
    template: template,
    context: {
      body: data,
    },
    attachments: files,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("An error occured");
    } else {
      console.log("Email sent: " + info.response);
      return res.status(StatusCodes.OK).send("Email Sent");
    }
  });
};

export default sendEmail;
