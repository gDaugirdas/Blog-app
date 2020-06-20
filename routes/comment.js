const express = require('express'),
  router = express.Router(),
  Blog = require('../models/blog'),
  Comment = require('../models/comment'),
  middlewareAdminAuth = require('../middleware/adminAuth');

// COMMENT CREATE ROUTE
router.post('/blogs/:id/comments', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      req.flash(
        'error',
        'Įvyko duomenų bazės klaida, prašome pranešti administratoriui'
      );
      res.redirect('/blogs');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          res.redirect('/blogs');
        } else {
          blog.comments.push(comment);
          blog.save();
          res.redirect('/blogs/' + blog._id);
        }
      });
    }
  });
});

// COMMENT DELETE ROUTE
router.delete(
  '/blog/:id/:comment_id',
  middlewareAdminAuth.checkAdminPrivilige,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err) {
        req.flash(
          'error',
          'Įvyko duomenų bazės klaida, prašome pranešti administratoriui'
        );
        res.redirect('/blogs/' + req.params.id);
      } else {
        req.flash('success', 'Komentaras sėkmingai ištrintas!');
        res.redirect('/blogs/' + req.params.id);
      }
    });
  }
);

module.exports = router;
