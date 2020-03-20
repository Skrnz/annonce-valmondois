const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.data = {
		signalement: req.params.message,
		message: {},
	};

	view.on('init', next => {
		keystone.list('Message').model.findById(req.params.message).populate('annonce').exec((err, result) => {
			locals.data.message = result;
			next(err);
		});
	});
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'signalement';
	// Render the view
	view.render('signalement');
};
