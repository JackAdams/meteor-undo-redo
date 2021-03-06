Undo/Redo for Meteor
--------------------

This package is used to give the end user an infinite undo/redo stack, based on transactions made by the package `babrahams:transactions`.

An example app is up at [http://transactions.meteor.com/](http://transactions.meteor.com)

Repo for the example app is [here](https://github.com/JackAdams/transactions-example).

#### Quick Start

	meteor add babrahams:undo-redo

The package exposes an object called `tx` which has all the methods you need to get an undo/redo stack going.

You can make writes using an options hash with `{tx: true}` in it, as shown below, to make them undo/redo-able (note that `upsert` is not supported):

Instead of:

	Posts.insert({text: "My post"});

write:

	Posts.insert({text: "My post"}, {tx: true});
	
Instead of:

	Posts.update({_id: post_id}, {$set: {text: "My improved post"}});

write: 

	Posts.update({_id: post_id}, {$set: {text: "My improved post"}}, {tx: true});

Instead of:

	Posts.remove({_id: post_id});

write:

	Posts.remove({_id: post_id}, {tx: true});

The last thing you'll need to do is include the undo/redo buttons widget in a template:

	{{> undoRedoButtons}}

If it doesn't fit nicely into your app's design, you can fork this repo (as a starting point) and write your own widget. The only thing you need to do is have an event handler that fires these calls:

	tx.undo()

and

	tx.redo()

#### Writes to multiple documents in a single transaction

The examples above will automatically start a transaction and automatically commit the transaction.

If you want a transaction that encompasses actions on several documents, you need to explictly start and commit the transaction:

	tx.start("delete post");
	Posts.remove({_id: post_id}, {tx: true});
	Comments.find({post_id: post_id}).forEach(function(comment) {
	  Comments.remove({_id: comment._id}, {tx: true});
	});
	tx.commit();

Note that each comment has to be removed independently. Transactions don't support `{multi: true}`.
Note also that the argument passed to `tx.start()` is the text that will appear on the undo/redo buttons.

Now this post can be restored, along with all its comments, with one click of the "undo" button. (And then re-removed with a click of the "redo" button.)

__Note:__ by default, this package requires a logged in user for undo/redo buttons to show up. If you want one big, anonymous, shared undo/redo stack, you can set `tx.requireUser = false;` on both client and server.

__Note:__ The end user only gets (by default) the set of transactions they made from 5 minutes before their last browser refresh. All transactions persist until the next browser refresh, so if a user last refreshed their browser 40 minutes ago, they'll have 45 minutes worth of transactions in their client-side stack. This time can be changed by setting `tx.undoTimeLimit = <number of seconds>`  __on the server__.

__Also note:__ This is all "last write wins". No Operational Transform going on here. If a document has been modified by a different transaction than the one you are trying to undo, the undo will be cancelled (and the user notified via a callback -- which, by default, is an alert -- you can overwrite this with your own function using `tx.onTransactionExpired = function() { ... }` -- or switch it off using `tx.onTransactionExpired = null;`). If users are simultaneously writing to the same sets of documents via transactions, a scenario could potentially arise in which neither user was able to undo their last transaction. This package will not work well for multiple writes to the same document by different users - e.g. Etherpad type apps.

__Warning:__ because this package relies on `babrahams:transactions`, which does something like a [mongo 2-phase commit](http://docs.mongodb.org/manual/tutorial/perform-two-phase-commits/), using this package to create an undo/redo stack will cause more than twice the usual number of db writes. Also, this packages sets up a publication and unique subscription for each connected client, so using this package could add substantial load to your server(s).

#### Full documentation

Full documentation about `babrahams:transactions` is available at https://github.com/JackAdams/meteor-transactions.  We __strongly__ recommend reading through this before attempting to use this package.  All the security info is there.