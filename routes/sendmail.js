const nodemailer = require('nodemailer');
var keystone = require('keystone');

exports.sendMailToAdmins = ({ subject, text, html }) => {
	keystone.list('User').model.find({ isAdmin: true }).exec((err, result) => {
		result.forEach(user => {
			this.sendMail({
				to: user.email,
				subject: subject,
				text: text,
				html: html,
			});
		});
	});
};

exports.sendMail = ({ from, to, subject, text, html, replyTo }) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_CONFIGURATION_SMTP || 'smtp.online.net',
		port: parseInt(process.env.EMAIL_CONFIGURATION_PORT) || 587,
		secure: false || process.env.EMAIL_CONFIGURATION_SECURE,
		auth: {
			user: process.env.EMAIL_CONFIGURATION_USER || 'william@wsconseil.com',
			pass: process.env.EMAIL_CONFIGURATION_PWD || 'WSConseil2008',
		},
	});
	const adrEmail = 'Ne pas répondre <valmondois-entr-aide@valmondois.fr>';
	const mailOptions = {
		from: from || adrEmail,
		sender: from || adrEmail,
		to: to,
		subject: subject,
		text: text,
		html: html,
		replyTo: replyTo || adrEmail,
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			return { err: `failed to send mail: ${err}` };
		} else {
			return { success: `email sent: ${info}` };
		}
	});
};
