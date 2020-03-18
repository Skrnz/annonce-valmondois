const nodemailer = require('nodemailer');

exports.sendMail = ({ to, subject, text, html }) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_CONFIGURATION_SMTP || 'smtp.online.net',
		port: parseInt(process.env.EMAIL_CONFIGURATION_PORT) || 587,
		secure: false || process.env.EMAIL_CONFIGURATION_SECURE,
		auth: {
			user: process.env.EMAIL_CONFIGURATION_USER || 'william@wsconseil.com',
			pass: process.env.EMAIL_CONFIGURATION_PWD || 'WSConseil2008',
		},
	});
	const mailOptions = {
		from: 'nepasrepondre@valmondois.fr',
		to: to,
		subject: subject,
		text: text,
		html: html,
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			return { err: `failed to send mail: ${err}` };
		} else {
			return { success: `email sent: ${info}` };
		}
	});
};
