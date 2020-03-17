const keystone = require('keystone');
const Annonce = keystone.list('Annonce');

exports.Save = (req, res) => {
	const newAnnonce = new Annonce.model();
	const updater = newAnnonce.getUpdateHandler(req);
	updater.process(req.body, {
		flashErrors: true,
		fields: 'titre, type, message, nom, prenom, telephone, email, quartier',
		errorMessage: 'Problème lors de l\'enregistrment de l\'annonce',
	}, function (err) {
		if (err) {
			res.status(500).json({ error: err });
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

exports.Valide = async (req, res) => {
	console.log('Valide', req.params.annonce);
	const annonce = await keystone.list('Annonce').model.findOne({ _id: req.params.annonce });
	const updater = annonce.getUpdateHandler(req);
	updater.process({ validee: true }, {
		flashErrors: true,
		fields: 'validee',
		errorMessage: 'Problème lors de la validation de l\'annonce',
	}, function (err) {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).json({ success: true, message: 'Annonce validée' });
		}
	});
};

exports.Delete = async (req, res) => {
	console.log('Delete', req.params.annonce);
	const result = await keystone.list('Annonce').model.deleteOne({ _id: req.params.annonce });
	if (result.result.ok) {
		res.status(200).json({ success: true, message: 'Annonce supprimée' });
	} else {
		res.status(500).json({ error: 'erreur lors de la suppression' });
	}
};
