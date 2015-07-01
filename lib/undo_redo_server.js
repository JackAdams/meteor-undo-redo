// TRANSACTIONS PUBLICATION

Meteor.startup(function() {
  Meteor.publish('transactions', function () {
	var lastAllowedTransactionTime = new Date();
	lastAllowedTransactionTime.setSeconds(lastAllowedTransactionTime.getSeconds() + tx.undoTimeLimit);
    return tx.Transactions.find({user_id: this.userId, lastModified: {$gt: lastAllowedTransactionTime}, expired:{$exists:false}}, {fields:{items:1,user_id:1,timestamp:1,undone:1,description:1}}, {sort: {lastModified: -1}});
  });
});