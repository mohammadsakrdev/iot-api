const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.sendEmail = (to, from, subject, body) => {
  return transporter
    .sendMail({
      to: to,
      from: from,
      subject: subject,
      html: `<h1>${body}</h1>`
    })
    .catch(err => {
      console.log(err);
    });
};
