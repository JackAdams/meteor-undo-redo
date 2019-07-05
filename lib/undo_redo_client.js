// Undo/redo button subscriptions, helpers and event handlers
// using the `babrahams:transactions` package to power the transactions

// Make undo-redo stack specific to the logged in user, unless there is no `accounts-base` package installed
tx.requireUser = (!!Package['accounts-base']) ? true : false;

// Make it possible to use this package without accounts-base
var meteorUserId = function () {
  if (!!Package['accounts-base']) {
	return Meteor.userId();  
  }
  else {
	return null;  
  }
}

// Return a selector
var addContextSelector = function (sel, contextSelector) {
  if (contextSelector && _.size(contextSelector)) {
	_.each(contextSelector, function (v, k) {
	  check(k, String);
	  var contextItem = {};
	  contextItem["context." + k] = v;
	  _.extend(sel, contextItem);
	});
  }
}

var undoneRedoConditions = function (contextSelector) {
  var undoneRedoConditions = {$exists: true, $ne: null};
  var sel = {user_id: meteorUserId(), $or: [{undone: null}, {undone: {$exists: false}}], expired: {$exists: false}}; 
  if (contextSelector) {
	addContextSelector(sel, contextSelector);  
  }
  var lastAction = tx.Transactions.findOne(sel, {sort: {lastModified: -1}});
  if (lastAction) {
	undoneRedoConditions['$gt'] = lastAction.lastModified; 
  }
  return undoneRedoConditions;
}

var nextToUndo = function (contextSelector) {
  var sel = {user_id: meteorUserId(), $or: [{undone: null}, {undone: {$exists: false}}], expired: {$exists: false}};
  if (contextSelector) {
	addContextSelector(sel, contextSelector);  
  }
  var doc = tx.Transactions.findOne(sel, {sort: {lastModified: -1}});
  return doc && doc._id;
}

var nextToRedo = function (contextSelector) {
  var sel = {user_id: meteorUserId(), undone: undoneRedoConditions(contextSelector), expired: {$exists: false}};
  if (contextSelector) {
	addContextSelector(sel, contextSelector);  
  }
  var doc = tx.Transactions.findOne(sel, {sort: {lastModified: 1}});
  return doc && doc._id;
}

////////// Subscription //////////

Template.undoRedoButtons.onCreated(function () {
  var self = this;
  self.autorun(function() {
    if (meteorUserId()) {
      var currentData = Template.currentData();
      self.subscribe('transactions', currentData && currentData.contextSelector);
    }
  });
});

////////// Undo and Redo buttons //////////

Template.undoRedoButtons.helpers({
  
  // expired: {$exists: false} is checked for autopublish scenarios -- even though expired is not a published field
  
  hideUndoButton : function() {
    return (!!nextToUndo(this.contextSelector)) ? '' : 'hide-undo-button';
  },
  
  hideRedoButton : function() {
    return (!!nextToRedo(this.contextSelector)) ? '' : 'hide-redo-button';
  },
  
  action : function(type) {
    var sel = {user_id: meteorUserId(), expired: {$exists: false}}; // This is for autopublish scenarios
    var existsOrNot = (type === 'redo') ? {undone: undoneRedoConditions(this.contextSelector)} : {$or: [{undone: null}, {undone: {$exists: false}}]};
    var sorter = {};
    sorter[(type === 'redo') ? 'undone' : 'lastModified'] = -1;
    var transaction = tx.Transactions.findOne(_.extend(sel, existsOrNot), {sort: sorter});
    return transaction && transaction.description;
  },
  
  undoRedoButtonclass : function() {
    return tx && _.isString(tx.undoRedoButtonClass) && tx.undoRedoButtonClass || '';
  }
  
});

Template.undoRedoButtons.events({
    
  'click .tx-undo-button' : function() {
    tx.undo(nextToUndo(this.contextSelector));    
  },
  
  'click .tx-redo-button' : function() {
    tx.redo(nextToRedo(this.contextSelector));    
  }
    
});