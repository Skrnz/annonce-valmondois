const keystone = require('keystone');
const Annonce = keystone.list('Annonce');
const sendMail = require('../sendmail');

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

exports.Envoyer = async (req, res) => {
	try {
		const annonce = await keystone.list('Annonce').model.findByIdAndUpdate(req.params.annonce, { $inc: { nbClick: 1 } });
		// sauvegarde message
		const message = await keystone.list('Message').model.create({
			nom: req.body.nom,
			prenom: req.body.prenom,
			telephone: req.body.telephone,
			email: req.body.email,
			message: req.body.message,
			annonce: req.params.annonce,
		});
		sendMail.sendMail({
			to: annonce.email,
			subject: `Votre annonce ${annonce.titre} intéresse quelqu'un`,
			text: `Votre annonce: ${annonce.titre} intéresse ${req.body.prenom} ${req.body.nom}, joignable par mail (${req.body.email}) ou par téléphone (${req.body.telephone})\n\n${req.body.message}`,
			html: `Votre annonce: <strong>${annonce.titre}</strong> intéresse <strong>${req.body.prenom} ${req.body.nom}</strong><br/>
					joignable par <a href="mailto:${req.body.email}">mail</a><br/>
					ou par téléphone (<a href="tel:${req.body.telephone}">${req.body.telephone}</a>)<br/><br/>
					cette personne vous adresse le message suivant:<br/>
					${req.body.message}<br/><br/>
					Si vous considérez ce message comme inapproprié, cliquez <a href="${process.env.ROOT_URL}/signalement/${message._id}">ici</a><br/>
					ou faites le nous savoir par le <a href="${process.env.ROOT_URL}/contact">formulaire de contact</a>`,
		});
		res.status(200).json({ success: true, message: 'Le propriétaire de l\'annonce a été averti, merci' });
	} catch (e) {
		res.status(500).json({ error: e });
	}
};

exports.Valide = async (req, res) => {
	console.log('Valide', req.params.annonce);
	const annonce = await keystone.list('Annonce').model.findById(req.params.annonce);
	const updater = annonce.getUpdateHandler(req);
	updater.process({ validee: true }, {
		flashErrors: true,
		fields: 'validee',
		errorMessage: 'Problème lors de la validation de l\'annonce',
	}, function (err) {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			sendMail.sendMail({
				to: annonce.email,
				subject: 'Votre annonce a été acceptée',
				text: `Votre annonce: ${annonce.titre} est validée sur le site d'entre aide de Valmondois, Merci !`,
				html: `Votre annonce: <strong>${annonce.titre}</strong> est validée sur le site d'entre aide de Valmondois, Merci !`,
			});
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
