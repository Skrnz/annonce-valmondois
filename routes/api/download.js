const keystone = require('keystone');
const fs = require('fs');

module.exports = async (req, res) => {
	const annonce = await keystone.list('Annonce').model.findByIdAndUpdate(req.params.id, { $inc: { nbClick: 1 } });
	if (annonce) {
		const path = keystone.expandPath(annonce.fichier.path) + '/uploads/' + unescape(annonce.fichier.originalname);
		return fs.access(path, fs.constants.F_OK, (err) => {
			if (err) {
				return res.status(500).json({ error: 'erreur, le fichier n\'existe pas' });
			} else {
				return res.status(200).sendFile(path);
			}
		});
	} else {
		return res.status(401).json({ error: 'invalid details' });
	}
};
