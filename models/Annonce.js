var keystone = require('keystone');
var Types = keystone.Field.Types;

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
	nbClick: { type: Number },
	validee: { type: Boolean },
});

/**
 * Registration
 */
Annonce.defaultColumns = 'titre, type, prenom, nom, dateDepot, quartier, validee';
Annonce.defaultSort = '-dateDepot';
Annonce.register();
