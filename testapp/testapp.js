Posts = new Mongo.Collection('posts');

tx.requireUser = false;

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
	tx.Transactions.remove({});
	Posts.remove({});
  });
}
