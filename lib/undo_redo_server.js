// TRANSACTIONS PUBLICATION

Meteor.startup(function() {
  Meteor.publish('transactions', function () {
    var lastAllowedTransactionTime = new Date();
    lastAllowedTransactionTime.setSeconds(lastAllowedTransactionTime.getSeconds() - tx.undoTimeLimit);
    var sel = {
      user_id: this.userId, 
      lastModified: {$gt: new Date(lastAllowedTransactionTime)}, 
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