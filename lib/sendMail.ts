import nodemailer from 'nodemailer';

export const sendServerInfoEmail = async (
  to: string,
  info: { label: string; ip: string; password: string }
) => {
  const transporter = nodemailer.createTransport({
    host: 'outbound.daouoffice.com', // 다우오피스 메일 서버 (mailplug)
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,     // 예: noreply@yourcompany.com
      pass: process.env.EMAIL_PASS,     // 앱 비밀번호 또는 일반 비밀번호
    },
  });

  await transporter.sendMail({
    from: `"서버 포탈" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[서버 생성 알림] ${info.label}`,
    html: `
      <h3>서버가 성공적으로 생성되었습니다</h3>
      <ul>
        <li><strong>서버명:</strong> ${info.label}</li>
        <li><strong>IP 주소:</strong> ${info.ip}</li>
        <li><strong>비밀번호:</strong> ${info.password}</li>
      </ul>
    `,
  });
};
