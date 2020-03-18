const nodemailer = require('nodemailer');

exports.sendMail = ({ to, subject, text, html }) => {
	console.log('process.env.EMAIL_CONFIGURATION', process.env.EMAIL_CONFIGURATION);

	const emailConfig = JSON.parse(process.env.EMAIL_CONFIGURATION);
	// console.log('send mail with email config', emailConfig);

	const transporter = nodemailer.createTransport({
		host: emailConfig.host || 'smtp.online.net',
		port: parseInt(emailConfig.port) || 587,
		secure: false || emailConfig.secure,
		auth: {
			user: emailConfig.user || 'william@wsconseil.com',
			pass: emailConfig.pass || 'WSConseil2008',
		},
	});
	const mailOptions = {
		from: emailConfig.from || 'nepasrepondre@valmondois.fr',
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
