var keystone = require('keystone');
var Types = keystone.Field.Types;
const sendMail = require('../routes/sendmail');

/**
 * Annonce Model
 * ==========
 */
var Annonce = new keystone.List('Annonce', {
	map: { name: 'titre' },
});

Annonce.add({
	titre: { type: String, required: true },
	type: { type: Types.Select, options: 'Offre, Demande' },
	quartier: { type: Types.Select, options: 'PAL, CENTRE, NAZE, BUTRY, NESLES, PARMAIN, LOIN' },
	message: { type: Types.Textarea, height: 400 },
	nom: { type: String },
	prenom: { type: String },
	telephone: { type: String },
	email: { type: Types.Email },
	dateDepot: { type: Types.Datetime, default: Date.now, noedit: true },
	nbClick: { type: Number, noedit: true },
	validee: { type: Boolean },
});

Annonce.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Annonce.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Annonce.schema.methods.sendNotificationEmail = function () {
	const annonce = this;
	console.log('sendNotificationEmail');
	// envoie un mail à tous les admins du site
	keystone.list('User').model.find({ isAdmin: true }).exec((err, result) => {
		result.forEach(user => {
			sendMail.sendMail({
				to: user.email,
				subject: 'Nouvelle annonce à modérer',
				text: `Annonce: Nom : ${annonce.prenom} ${annonce.nom}, Email : ${annonce.email}, Téléphone : ${annonce.telephone}, Titre: ${annonce.titre}, Message : ${annonce.message}, lien: ${process.env.ROOT_URL}/keystone/annonces/${annonce._id}`,
				html: `Nouvelle annonce sur le site d'entre aide
					<ul>
						<li>Prénom : ${annonce.prenom}</li>
						<li>Nom : ${annonce.nom}</li>
						<li>Email : ${annonce.email}</li>
						<li>Téléphone : ${annonce.telephone}</li>
						<li>Type d'annonce : ${annonce.type}</li>
						<li>Titre : ${annonce.titre}</li>
						<li>Message : ${annonce.message}</li>
						<li>Quartier : ${annonce.quartier}</li>
						<li>Lien pour la modifier : <a href=${process.env.ROOT_URL}/keystone/annonces/${annonce._id}>Modifier</a></li>
					</ul>
					Si elle semble convenable, la valider directement en cliquant ce lien <a href="${process.env.ROOT_URL}/api/valide/${annonce._id}">Valider</a>`,
			});
		});
	});
};

/**
 * Registration
 */
Annonce.defaultColumns = 'titre, type, prenom, nom, dateDepot, quartier, validee, nbClick';
Annonce.defaultSort = '-dateDepot';
Annonce.register();
