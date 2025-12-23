/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import nodemailer from 'nodemailer';

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  const host = process.env.EMAIL_HOST; // e.g. "smtp.gmail.com"
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // use TLS for 465, STARTTLS otherwise
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"Website Contact" <${user}>`,
    to,
    subject,
    html,
  });
};
