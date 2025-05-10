import nodemailer from 'nodemailer'

interface MailInfo {
  to: string
  label: string
  ip: string
  password: string
}

export async function sendServerInfoEmail({ to, label, ip, password }: MailInfo) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 25),
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
      <h3>🚀 서버가 성공적으로 생성되었습니다.</h3>
      <p><strong>서버명:</strong> ${label}</p>
      <p><strong>IP 주소:</strong> ${ip}</p>
      <p><strong>루트 비밀번호:</strong> ${password}</p>
    `,
  })
}
