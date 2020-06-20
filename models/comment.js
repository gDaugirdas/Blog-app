const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	body: String,
	author: String,
	created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
