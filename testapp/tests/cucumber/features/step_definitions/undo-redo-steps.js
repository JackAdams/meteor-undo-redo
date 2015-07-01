(function () {

  'use strict';

  // You can include npm dependencies for support files in tests/cucumber/package.json
  var _ = require('underscore');

  module.exports = function () {

	this.Before(function (callback) {
	  this.server.call('reset').then(callback);
	});

// You can use normal require here, cucumber is NOT run in a Meteor context (by design)
var url = require('url');

this.Given(/^an action has already been performed called "([^"]*)"$/, function (action, callback) {
	  // Write code here that turns the phrase above into concrete actions
	  // Can't see anything from the first action
	  // Check that it's in the client db
	  // var updateTx = tx.Transactions.findOne({description: action});
	  // Why is tx undefined?
	  // TODO -- how do you do an assertation here that updateTx is defined?
	  this.client.call(callback);
	});
	
	this.When(/^another action has already been performed called "([^"]*)"$/, function (action, callback) {
	  // Write code here that turns the phrase above into concrete actions
	  this.client.
	  url(process.env.ROOT_URL).
	  waitForExist('body *').
	  waitForVisible('body *').
	  waitForExist('.undo-redo-action', 100).
	  getText('button#undo-button span.undo-redo-action').then(function (description) {
	assert.equal(description, action); 
	  }).
	  call(callback);
	});
	
	this.When(/^I click the undo button$/, function (callback) {
	  // Write code here that turns the phrase above into concrete actions
	  this.client.
	  click('#undo-button').
	  call(callback);
	});
	
	this.Then(/^the action on the undo button should now be "([^"]*)"$/, function (action, callback) {
	  // Write code here that turns the phrase above into concrete actions
	  this.client.
	  getText('button#undo-button span.undo-redo-action').then(function (description) {
	assert.equal(description, action); 
	  }).
	  call(callback);
	});

  };

})(); 