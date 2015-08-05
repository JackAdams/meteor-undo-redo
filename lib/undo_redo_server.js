// TRANSACTIONS PUBLICATION

// Make undo-redo stack specific to the logged in user
tx.requireUser = true;
  
// Publish user's transactions from the last five minutes (publication not reactive - so it will be everything from 5 minutes before the user's last page refresh)
// i.e. if the user doesn't refresh their page for 40 minutes, the last 45 minutes worth of their transactions will be published to the client

this.undoTimeLimit = 5 * 60; // Number of seconds

Meteor.startup(function() {
  Meteor.publish('transactions', function () {
	if (!this.userId && tx.requireUser) {
	  return;	
	}
    var lastAllowedTransactionTime = new Date();
    lastAllowedTransactionTime.setSeconds(lastAllowedTransactionTime.getSeconds() - tx.undoTimeLimit);
    var sel = {
      user_id: this.userId, 
      lastModified: {$gt: lastAllowedTransactionTime}, 
      expired: {$exists: false}, state: {$in: ['done','undone']}
    };
    var fields = {
      items:1,
      user_id:1,
      lastModified:1,
      undone:1,
      description:1,
      state:1
    };
    return tx.Transactions.find(sel, {fields: fields}, {sort: {lastModified: -1}});
  });
});