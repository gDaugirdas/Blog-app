const express = require('express'),
	router = express.Router(),
	Blog = require('../models/blog'),
	middlewareAdminAuth = require('../middleware/adminAuth'),
	middlewareSubscription = require('../middleware/subscription');

// REDIRECT TO INDEX
router.get('/', (req, res) => {
	res.redirect('/blogs');
});

// INDEX SHOW ROUTE
router.get('/blogs', (req, res) => {
	Blog.find({}, (err, allBlogs) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('/gallery');
		} else {
			res.render('index', {
				blogs: allBlogs,
				pageTitle: 'Koala Blog',
				pageDescription: 'Sveiki atvykę į Koalos tinkaraštį, čia rašau apie viską kas man šauną į galvą',
			});
		}
	});
});

// NEW ROUTE
router.get('/blogs/new', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	res.render('blog/new', {
		pageTitle: 'Naujas tinklaraščio įrašas',
		pageDescription: 'Pridėk naują Koalos tinklaraščio įrašą!',
	});
});

// CREATE ROUTE
router.post('/blogs', middlewareAdminAuth.checkAdminPrivilige, middlewareSubscription.sendSubscription, (req, res) => {
	Blog.create(req.body.blog, (err, newBlog) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.render('blog/new');
		} else {
			req.flash('success', 'Naujas tinklaraščio įrašas sėkmingai sukurtas!');
			res.redirect('/blogs/' + newBlog._id);
		}
	});
});

//SHOW ROUTE

router.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id)
		.populate('comments')
		.exec((err, foundBlog) => {
			if (err || !foundBlog) {
				res.redirect('/blogs');
			} else {
				Blog.find({}, (err, allBlogs) => {
					if (err) {
						req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
						res.redirect('/blogs');
					} else {
						res.render('blog/show', {
							blog: foundBlog,
							blogs: allBlogs,
							helpers: helpers,
							pageTitle: foundBlog.title,
							pageDescription: foundBlog.titleHeading,
						});
					}
				})
					.where('_id')
					.ne(req.params.id);
			}
		});
});

// EDIT ROUTE
router.get('/blogs/:id/edit', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err || !foundBlog) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('/blogs');
		} else {
			res.render('blog/edit', {
				blog: foundBlog,
				pageTitle: 'Redaguok ' + foundBlog.title,
				pageDescription: 'Tinklaraščio įrašo ' + foundBlog.titleHeading + ' redagavimo puslapis',
			});
		}
	});
});

// UPDATE ROUTE
router.put('/blogs/:id', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('/blogs');
		} else {
			req.flash('success', 'Tinklaraštis sėkmingai redaguotas!');
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

// DELETE ROUTE
router.delete('/blogs/:id', middlewareAdminAuth.checkAdminPrivilige, (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			req.flash('error', 'Įvyko duomenų bazės klaida, prašome pranešti administratoriui');
			res.redirect('/blogs');
		} else {
			req.flash('success', 'Tinklaraštis sėkmingai ištrintas!');
			res.redirect('/blogs');
		}
	});
});

module.exports = router;
