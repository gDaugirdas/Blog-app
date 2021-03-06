const express = require('express'),
	router = express.Router();

// SHOW ABOUT ROUTE
router.get('/about', (req, res) => {
	res.render('about', {
		pageTitle: 'Apie Koala Blog',
		pageDescription: 'Puslapis tinklaraštį ir jo autorių',
	});
});

// SHOW 404 ROUTE
router.use((req, res) => {
	res.status(404);
	res.render('404', {
		pageTitle: 'Puslapis nerastas',
		pageDescription: 'Puslapis nerastas',
	});
});

module.exports = router;
