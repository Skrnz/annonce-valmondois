const keystone = require('keystone');
const Annonce = keystone.list('Annonce');

exports.Save = (req, res) => {
	const newAnnonce = new Annonce.model();
	const updater = newAnnonce.getUpdateHandler(req);
	updater.process(req.body, {
		flashErrors: true,
		fields: 'titre, type, message, nom, prenom, telephone, email',
		errorMessage: 'Problème lors de l\'enregistrment de l\'annonce',
	}, function (err) {
		if (err) {
			console.log('erreur contact', err);
			res.status(500).json(err);
		} else {
			console.log('annonce saved');
			res.status(200).json({ success: true, message: 'Annonce enregistrée, en attente de modération, merci' });
		}
	});
};

exports.Envoyer = (req, res) => {
	console.log('req.params', req.params);
	console.log('req.body', req.body);
};
