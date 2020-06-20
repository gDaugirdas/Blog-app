const express = require('express'),
	router = express.Router(),
	Gallery = require('../models/gallery'),
	middlewareAdminAuth = require('../middleware/adminAuth');

// GALLERY SHOW ROUTE
router.get('/gallery', (req, res) => {
	Gallery.find({}, (err, allImages) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('/blogs');
		} else {
			res.render('gallery', {
				images: allImages,
				pageTitle: 'Nauotrauku galerija',
				pageDescription: 'Nuostabūs vaizdai užfiksuoti mano gyvenime',
				ogImage: allImages[0].image,
			});
		}
	});
});

// NEW ROUTE
router.get('/gallery/new', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	res.render('gallery/new', {
		pageTitle: 'Nauja nuotrauka',
		pageDescription: 'Pridėk naują nuotrauką',
		ogImage: './logo.png',
	});
});

// CREATE ROUTE
router.post('/gallery', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Gallery.create(req.body.gallery, (err, newImage) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.render('blog/new');
		} else {
			req.flash('success', 'Nauja nuotrauka sėkmingai pridėta!');
			res.redirect('/gallery');
		}
	});
});

// EDIT ROUTE
router.get('/gallery/:id/edit', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Gallery.findById(req.params.id, (err, foundImage) => {
		if (err || !foundImage) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.render('gallery');
		} else {
			res.render('gallery/edit', {
				image: foundImage,
				pageTitle: 'Redaguok nuotrauką',
				pageDescription: 'Nuotraukos redagavimo puslapis',
				ogImage: foundImage.image,
			});
		}
	});
});

// UPDATE ROUTE
router.put('/gallery/:id', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Gallery.findByIdAndUpdate(req.params.id, req.body.gallery, (err, updatedBlog) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('gallery/show');
		} else {
			req.flash('success', 'Nuotrauka sėkmingai redaguota!');
			res.redirect('/gallery/#' + req.params.id);
		}
	});
});

// DELETE ROUTE

router.delete('/gallery/:id', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Gallery.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('/gallery');
		} else {
			req.flash('success', 'Nuotrauka sėkmingai ištrinta!');
			res.redirect('/gallery');
		}
	});
});

module.exports = router;
