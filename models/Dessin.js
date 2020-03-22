var keystone = require('keystone');
var Types = keystone.Field.Types;
const sendMail = require('../routes/sendmail');

/**
 * Dessin Model
 * ==========
 */
var Dessin = new keystone.List('Dessin', {
	map: { name: 'titre' },
});

Dessin.add({
	titre: { type: String, required: true },
	dessin: { type: Types.CloudinaryImage },
	message: { type: Types.Textarea, height: 400 },
	nom: { type: String },
	prenom: { type: String },
	telephone: { type: String },
	email: { type: Types.Email },
	dateDepot: { type: Types.Datetime, default: Date.now, noedit: true },
	nbClick: { type: Number, noedit: true },
	valide: { type: Boolean },
});

Dessin.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Dessin.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Dessin.schema.methods.sendNotificationEmail = function () {
	const dessin = this;
	console.log('sendNotificationEmail');
	// envoie un mail à tous les admins du site
	sendMail.sendMailToAdmins({
		subject: 'Nouveau dessin à modérer',
		text: `Dessin: Nom : ${dessin.prenom} ${dessin.nom}, Email : ${dessin.email}, Téléphone : ${dessin.telephone}, Titre: ${dessin.titre}, Message : ${dessin.message}, lien: ${process.env.ROOT_URL}/keystone/dessins/${dessin._id}`,
		html: `Nouveau dessin sur le site d'entre aide
			<ul>
				<li>Prénom : ${dessin.prenom}</li>
				<li>Nom : ${dessin.nom}</li>
				<li>Email : ${dessin.email}</li>
				<li>Téléphone : ${dessin.telephone}</li>
				<li>Titre : ${dessin.titre}</li>
				<li>Message : ${dessin.message}</li>
				<li>Lien pour la modifier : <a href=${process.env.ROOT_URL}/keystone/dessins/${dessin._id}>Modifier</a></li>
			</ul>
			<p>Si il semble convenable, le valider directement en cliquant ce lien <a href="${process.env.ROOT_URL}/api/validedessin/${dessin._id}">Valider</a></p>
			<img src=${dessin._.dessin.fill(400, 300)}>
			`,
	});
};

/**
 * Registration
 */
Dessin.defaultColumns = 'titre, prenom, nom, dateDepot, valide, nbClick';
Dessin.defaultSort = '-dateDepot';
Dessin.register();
