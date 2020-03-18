/* eslint-disable linebreak-style */
var keystone = require('keystone');
var Contact = keystone.list('Contact');

exports.update = function (req, res) {
	console.log('post contact', req.body);
	var newEnquiry = new Contact.model();
	var updater = newEnquiry.getUpdateHandler(req);
	updater.process(req.body, {
		flashErrors: true,
		fields: 'nom, prenom, email, telephone, message',
		errorMessage: 'problème lors de l\'envoi de la demande de contact',
	}, function (err) {
		if (err) {
			console.log('erreur contact', err);
			res.status(500).json({ error: err.error + '-' + err.detail.message.error });
		} else {
			console.log('contact enregistré');
			res.status(200).json({ success: true, message: 'Contact envoyé' });
		}
	});
};
