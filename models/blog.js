const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	tag: String,
	title: String,
	blogImage: String,
	blogImageAlt: String,
	titleHeading: String,
	created: { type: Date, default: Date.now },
	body: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
});

module.exports = mongoose.model('Blog', blogSchema);
