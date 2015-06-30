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

    this.Given(/^I am a new user$/, function () {
      // no callbacks! DDP has been promisified so you can just return it
      return this.server.call('reset'); // this.ddp is a connection to the mirror
    });

    this.When(/^I navigate to "([^"]*)"$/, function (relativePath, callback) {
      // WebdriverIO supports Promises/A+ out the box, so you can return that too
      this.client. // this.browser is a pre-configured WebdriverIO + PhantomJS instance
        url(url.resolve(process.env.ROOT_URL, relativePath)). // process.env.ROOT_URL always points to the mirror
        call(callback);
    });

    this.Then(/^I should see the title "([^"]*)"$/, function (expectedTitle, callback) {
      // you can use chai-as-promised in step definitions also
      this.client.
        waitForVisible('body *'). // WebdriverIO chain-able promise magic
        getTitle().should.become(expectedTitle).and.notify(callback);
    });

    this.Given(/^an action has already been performed called "([^"]*)"$/, function (action, callback) {
	  // Write code here that turns the phrase above into concrete actions
	  // Can't see anything from the first action
	  // Check that it's in the client db
	  // var updateTx = tx.Transactions.findOne({description: action});
	  // Why is tx undefined?
	  // TODO -- how do you do an assertation here that updateTx is defined?
	  this.client.call(callback);
	});
	
	this.When(/^an action has already been performed called and "([^"]*)"$/, function (action, callback) {
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
	    assert.equal(description, 'update post'); 
	  }).
	  call(callback);
	});

  };

})(); 