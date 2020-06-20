const express = require('express'),
	router = express.Router(),
	User = require('../models/user'),
	passport = require('passport');

// REGISTER SHOW ROUTE
router.get('/register', (req, res) => {
	res.render('register', {
		pageTitle: 'Registracija',
		pageDescription: 'Sukurk naują paskyrą!',
		ogImage: './logo.png',
	});
});

// REGISTER CREATE ROUTE (CREATE NEW USER)
router.post('/register', (req, res) => {
	const newUser = new User({ username: req.body.username });
	//If req.body.adminCode value matches the below string, make user an admin
	if (req.body.adminCode === '<<CODETOBECOMEANADMIN>>') {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			return res.redirect(req.get('referer'));
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/blogs');
		});
	});
});

// SHOW LOGIN FORM
router.get('/login', (req, res) => {
	res.render('login', {
		pageTitle: 'Prisjungimas',
		pageDescription: 'Prisijunk prie savo paskyros!',
		ogImage: './logo.png',
	});
});

// HANDE LOGIN LOGIC
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/blogs',
		failureRedirect: '/login',
		failureFlash: 'Klaidingai įvesti prisijungimo duomenys',
	}),
	(req, res) => {}
);

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect(req.get('referer'));
});

module.exports = router;
