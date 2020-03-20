const keystone = require('keystone');
const sendMail = require('../sendmail');

exports.signaler = async (req, res) => {
	const message = await keystone.list('Message').model.findById(req.body.signalement_id).populate('annonce');
	const updater = message.getUpdateHandler(req);
	updater.process({ raison: req.body.message, signale: true, dateSignale: new Date() }, {
		flashErrors: true,
		fields: 'signale, raison, dateSignale',
		errorMessage: 'Problème lors de l\'enregistrement du signalement',
	}, function (err) {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			sendMail.sendMail({
				to: message.annonce.email,
				subject: 'Signalement',
				text: `Votre signalement a été enreistré, merci`,
				html: `Votre signalement a été enreistré, merci`,
			});
			sendMail.sendMailToAdmins({
				subject: 'Nouveau signamlement enregistré',
				text: `de ${message.annonce.prenom} ${message.annonce.nom} pour l'annonce ${message.annonce.titre} à l'encontre de ${message.prenom} ${message.nom} ${message.email}\n
						accéder au message signalé ici : ${process.env.ROOT_URL}/keystone/messages/${message._id}`,
				html: `de <ul>
					<li> ${message.annonce.prenom} ${message.annonce.nom} </li>
					<li> pour l'annonce ${message.annonce.titre} </li>
					<li> à l'encontre de ${message.prenom} ${message.nom} ${message.email} </li>
					<li> accéder au message signalé <a href=${process.env.ROOT_URL}/keystone/messages/${message._id}>ici</a>`,
			});
			res.status(200).json({ success: true, message: 'signalement enregistré, merci' });
		}
	});
};
