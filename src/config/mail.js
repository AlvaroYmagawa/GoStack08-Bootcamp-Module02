export default {
  host: process.env.MAIL_HOSTMAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  dafault: {
    from: 'Equipe GoBarber <noreply@gobarber.com',
  },
};
