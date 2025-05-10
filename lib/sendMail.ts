// lib/sendMail.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'outbound.daouoffice.com', // 다우오피스 SMTP 호스트 (메일플러그 사용)
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,        // 예: noreply@yourdomain.com
    pass: process.env.MAIL_PASS         // 앱 비밀번호 또는 계정 비밀번호
  }
});

export async function sendServerInfoEmail(to: string, { label, ip, password }: { label: string, ip: string, password: string }) {
  const info = await transporter.sendMail({
    from: `"NEBULAX" <${process.env.MAIL_USER}>`,
    to,
    subject: `서버 "${label}" 정보`,
    html: `
      <h2>서버가 성공적으로 생성되었습니다.</h2>
      <ul>
        <li><strong>이름:</strong> ${label}</li>
        <li><strong>IP 주소:</strong> ${ip}</li>
        <li><strong>비밀번호:</strong> ${password}</li>
      </ul>
    `
  });

  console.log('메일 전송 완료:', info.messageId);
}
