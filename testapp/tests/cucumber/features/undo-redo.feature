Feature: Undoing and redoing actions via the undo-redo buttons

  # Make sure the undo button is working
  @dev
  Scenario: Clicking the undo button will undo the last action
    Given an action has already been performed called "update post"
	And another action has already been performed called "remove post"
	When I click the undo button
	Then the action on the undo button should now be "update post"