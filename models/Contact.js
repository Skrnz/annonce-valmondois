const keystone = require('keystone');
const Types = keystone.Field.Types;
const sendMail = require('../routes/sendmail');

/**
 * Contact Model
 * =============
 */

const Contact = new keystone.List('Contact', {
	map: { name: 'nom' },
	nocreate: true,
	noedit: true,
});

Contact.add({
	nom: { type: String, required: true },
	prenom: { type: String, required: true },
	email: { type: Types.Email, required: true },
	telephone: { type: String },
	message: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

Contact.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Contact.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Contact.schema.methods.sendNotificationEmail = function () {
	const contact = this;
	console.log('sendNotificationEmail');
	// envoie un mail à tous les admins du site
	keystone.list('User').model.find({ isAdmin: true }).exec((err, result) => {
		result.forEach(user => {
			sendMail.sendMail({
				to: user.email,
				subject: 'Contact sur le site internet',
				text: `Nouveau contact sur le site web: Nom : ${contact.prenom} ${contact.nom}, Email : ${contact.email}, Téléphone : ${contact.telephone}, Message : ${contact.message}`,
				html: `Nouveau contact sur le site web
					<ul>
						<li>Prénom : ${contact.prenom}</li>
						<li>Nom : ${contact.nom}</li>
						<li>Email : ${contact.email}</li>
						<li>Téléphone : ${contact.telephone}</li>
						<li>Message : ${contact.message}</li>
						<li>Lien : ${process.env.ROOT_URL}/keystone/contacts/${contact._id}</li>
					</ul>`,
			});
		});
	});

};

Contact.defaultSort = '-createdAt';
Contact.defaultColumns = 'nom, email, message, createdAt';
Contact.register();
