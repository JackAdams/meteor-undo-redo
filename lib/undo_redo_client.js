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

////////// Subscription //////////

Meteor.startup(function() {
  Tracker.autorun(function() {
    if (meteorUserId()) {
      Meteor.subscribe('transactions');
    }
  });
});

////////// Undo and Redo buttons //////////

Template.undoRedoButtons.helpers({
  
  // expired: {$exists: false} is checked for autopublish scenarios -- even though expired is not a published field
  
  hideUndoButton : function() {
    return (tx.Transactions.find({user_id:meteorUserId(),$or:[{undone:null}, {undone:{$exists: false}}], expired: {$exists: false}}).count()) ? '' : 'hide-undo-button';
  },
  
  hideRedoButton : function() {
    return (tx.Transactions.find({user_id:meteorUserId(), undone: {$exists: true, $ne: null}, expired: {$exists: false}}).count()) ? '' : 'hide-redo-button';
  },
  
  action : function(type) {
    var sel = {user_id: meteorUserId(), expired: {$exists: false}}; // This is for autopublish scenarios
    var existsOrNot = (type === 'redo') ? {undone: {$exists:true, $ne:null}} : {$or: [{undone: null}, {undone: {$exists: false}}]};
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
    
  'click #undo-button' : function() {
    tx.undo();    
  },
  
  'click #redo-button' : function() {
    tx.redo();    
  }
    
});