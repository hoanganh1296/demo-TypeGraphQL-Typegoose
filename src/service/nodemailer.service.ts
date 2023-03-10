import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import config from "config";

const user: string = config.get<string>("email_username");
const password: string = config.get<string>("email_password");

const Email = (options: MailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user,
      pass: password,
    },
  });
  transporter.sendMail(options, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

//send mail
const EmailSender = (code: string) => {
  const options: MailOptions = {
    from: "dianna.lakin@ethereal.email",
    to: "anhdev.testmail@gamil.com",
    subject: "Message create Voucher",
    html: `<h1>${code}</h1>`,
  };

  Email(options);
};

export default EmailSender;
