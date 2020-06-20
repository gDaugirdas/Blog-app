const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
	imageHeading: String,
	imageAlt: String,
	image: String,
});

module.exports = mongoose.model('Gallery', gallerySchema);
