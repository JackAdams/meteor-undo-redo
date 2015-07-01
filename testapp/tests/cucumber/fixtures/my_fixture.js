(function () {

  'use strict';

  Meteor.methods({
'reset' : function() {
  // you can do some resetting of your app here
  // fixture code will only execute inside mirrors neither runs
  // inside the main app nor gets bundled to production.
	  tx.Transactions.remove({});
	  Posts.remove({});
	  // Create some actions
	  var postId = Posts.insert({title: "Title 1"},{tx: true, instant: true});
	  Posts.update({_id:postId},{$set:{title: "Title 2"}},{tx: true});
	  Posts.remove({_id:postId},{tx: true});
}
  });

})();