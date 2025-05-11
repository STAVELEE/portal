// lib/sendMail.ts
import nodemailer from 'nodemailer';

export const sendServerInfoEmail = async (to: string, info: { label: string, ip: string, password: string }) => {
  const transporter = nodemailer.createTransport({
    host: 'outbound.daouoffice.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Vultr Portal" <${process.env.SMTP_USER}>`,
    to,
    subject: `[서버 생성 완료] ${info.label}`,
    text: `서버 정보\n이름: ${info.label}\nIP: ${info.ip}\n비밀번호: ${info.password}`,
  });
};