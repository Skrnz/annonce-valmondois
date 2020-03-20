const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'listeSignalements';
	locals.data = {
		signalements: [],
	};

	view.on('init', next => {
		keystone.list('Message').model.find({ signale: true }).populate('annonce').sort('-dateSignale').exec((err, result) => {
			locals.data.signalements = result;
			next(err);
		});
	});

	// Render the view
	view.render('listeSignalements');
};
