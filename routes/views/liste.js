const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'liste';
	locals.data = {
		annonces: [],
		dessins: [],
	};

	view.on('init', next => {
		keystone.list('Annonce').model.find().sort('-dateDepot').exec((err, result) => {
			locals.data.annonces = result;
			next(err);
		});
	});
	view.on('init', next => {
		keystone.list('Dessin').model.find().sort('-dateDepot').exec((err, result) => {
			locals.data.dessins = result;
			next(err);
		});
	});

	// Render the view
	view.render('liste');
};
