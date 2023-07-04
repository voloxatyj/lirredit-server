import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (
  email: string,
  subject: string,
  payload: object,
  template: string,
) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const source = fs.readFileSync(path.join(`${process.cwd()}/src/utils`, template), 'utf8');
  const compiledTemplate = handlebars.compile(source);

  const info = await transporter.sendMail({
    from: `${testAccount.user}`,
    to: email,
    subject,
    html: compiledTemplate(payload),
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
