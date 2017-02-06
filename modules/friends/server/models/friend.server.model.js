'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Friend Schema
 */
let FriendSchema = new Schema({
	friend: {
		type: Object,
		default: ''
	},
	added: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Friend', FriendSchema);
