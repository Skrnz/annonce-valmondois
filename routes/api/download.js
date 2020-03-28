const keystone = require('keystone');
const fs = require('fs');

module.exports = async (req, res) => {
	const Annonce = keystone.list('Annonce');
	Annonce.model.findById(req.params.id).exec(function (err, annonce) {
		if (annonce) {
			const path = keystone.expandPath(annonce.fichier.path) + '/' + unescape(annonce.fichier.originalname);
			return fs.access(path, fs.constants.F_OK, (err) => {
				if (err) {
					return res.status(500).json({ error: 'erreur, le fichier n\'existe pas' });
				} else {
					return res.status(200).sendFile(path);
				}
			});
		} else if (err) {
			return res.status(500).json({ error: 'database error', detail: err });
		} else {
			return res.status(401).json({ error: 'invalid details' });
		}
	});
};
