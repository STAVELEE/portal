// lib/sendMail.ts
import nodemailer from 'nodemailer'

export async function sendServerInfoEmail(to: string, info: { label: string; ip: string; password: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  })

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDR}>`,
    to,
    subject: `[서버 생성 완료] ${info.label}`,
    html: `
      <h3>서버 정보</h3>
      <ul>
        <li><strong>이름:</strong> ${info.label}</li>
        <li><strong>IP:</strong> ${info.ip}</li>
        <li><strong>비밀번호:</strong> ${info.password}</li>
      </ul>
    `,
  }

  return await transporter.sendMail(mailOptions)
}
