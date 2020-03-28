var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/depos', routes.views.depos);
	app.get('/contact', routes.views.contact);
	app.get('/listeannonces', routes.views.liste);
	app.get('/listesignalements', routes.views.listeSignalements);
	app.get('/signalement/:message', routes.views.signalement);

	app.post('/api/validation', routes.api.annonce.Save);
	app.post('/api/envoyer/:annonce', routes.api.annonce.Envoyer);
	app.get('/api/valide/:annonce', routes.api.annonce.Valide);
	app.get('/api/delete/:annonce', routes.api.annonce.Delete);
	// download publication
	app.get('/api/download/:id', routes.api.download);

	app.post('/api/enregistredessin', routes.api.dessin.Save);
	app.get('/api/validedessin/:dessin', routes.api.dessin.Valide);
	app.get('/api/deletedessin/:dessin', routes.api.dessin.Delete);

	app.post('/api/request', routes.api.contact.update);
	app.post('/api/signalement', routes.api.signalement.signaler);
};
