// lib/sendMail.ts
import nodemailer from 'nodemailer'

interface EmailParams {
  to: string
  label: string
  ip: string
  password: string
}

export async function sendServerInfoEmail({ to, label, ip, password }: EmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDR}>`,
    to,
    subject: `[서버 생성 완료] ${label}`,
    html: `
      <h3>✅ 서버가 성공적으로 생성되었습니다</h3>
      <ul>
        <li><strong>이름:</strong> ${label}</li>
        <li><strong>IP:</strong> ${ip}</li>
        <li><strong>비밀번호:</strong> ${password}</li>
      </ul>
    `,
  })
}
