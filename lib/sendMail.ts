import nodemailer from 'nodemailer'

export const sendServerInfoEmail = async (
  to: string,
  info: { label: string; ip: string; password: string }
) => {
  const transporter = nodemailer.createTransport({
    host: 'outbound.daouoffice.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASS!,
    },
  })

  const mailOptions = {
    from: `"Vultr 포털" <${process.env.MAIL_USER}>`,
    to,
    subject: `[Vultr] 서버 정보 - ${info.label}`,
    html: `
      <h3>${info.label} 서버 정보</h3>
      <p><strong>IP:</strong> ${info.ip}</p>
      <p><strong>비밀번호:</strong> ${info.password}</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}
