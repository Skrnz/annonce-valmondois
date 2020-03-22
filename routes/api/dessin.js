const keystone = require('keystone');
const Dessin = keystone.list('Dessin');
const sendMail = require('../sendmail');

exports.Save = (req, res) => {
	const newDessin = new Dessin.model();
	const updater = newDessin.getUpdateHandler(req);
	updater.process(req.body, {
		flashErrors: true,
		fields: 'titre, message, nom, prenom, telephone, email, dessin',
		errorMessage: 'Problème lors de l\'enregistrment du dessin',
	}, function (err) {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			console.log('dessin saved');
			res.status(200).json({ success: true, message: 'Dessin enregistrée, en attente de modération, merci' });
		}
	});
};

exports.Valide = async (req, res) => {
	const dessin = await keystone.list('Dessin').model.findById(req.params.dessin);
	const updater = dessin.getUpdateHandler(req);
	updater.process({ valide: true }, {
		flashErrors: true,
		fields: 'valide',
		errorMessage: 'Problème lors de la validation du dessin',
	}, function (err) {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			sendMail.sendMail({
				to: dessin.email,
				subject: 'Votre dessin a été accepté',
				text: `Votre dessin: ${dessin.titre} est validé sur le site d'entre aide de Valmondois, Merci !`,
				html: `<p>Votre dessin: <strong>${dessin.titre}</strong> est validé sur le site d'entre aide de Valmondois, Merci !</p>
						<img src=${dessin._.dessin.fill(400, 300)}>
						`,
			});
			res.status(200).json({ success: true, message: 'Dessin validé' });
		}
	});
};

exports.Delete = async (req, res) => {
	console.log('Delete', req.params.dessin);
	const result = await keystone.list('Dessin').model.deleteOne({ _id: req.params.dessin });
	if (result.result.ok) {
		res.status(200).json({ success: true, message: 'Dessin supprimé' });
	} else {
		res.status(500).json({ error: 'erreur lors de la suppression' });
	}
};
