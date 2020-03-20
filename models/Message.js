var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Message Model
 * ==========
 */
var Message = new keystone.List('Message', {
	map: { name: 'nom' },
	nocreate: true,
	noedit: true,
});

Message.add({
	nom: { type: String },
	prenom: { type: String },
	telephone: { type: String },
	email: { type: Types.Email },
	message: { type: Types.Textarea, height: 300 },
	annonce: { type: Types.Relationship, ref: 'Annonce' },
	signale: { type: Boolean },
	dateSignale: { type: Types.Datetime, label: 'Date de signalement', dependsOn: { signale: true } },
	raison: { type: Types.Textarea, height: 200, dependsOn: { signale: true } },
	dateMessage: { type: Types.Datetime, default: Date.now },
});


/**
 * Registration
 */
Message.defaultColumns = 'nom, prenom, email, annonce, signale, dateMessage';
Message.defaultSort = '-dateMessage';
Message.register();
