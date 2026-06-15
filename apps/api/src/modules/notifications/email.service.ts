import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

export async function sendEmail(input: { to: string | string[]; subject: string; html: string; text?: string }) {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined
  });

  return transporter.sendMail({
    from: env.SMTP_FROM,
    to: Array.isArray(input.to) ? input.to.join(',') : input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });
}
