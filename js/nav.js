"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

// On "submit" this displays the submit form and story list

 /*******************************************************
 We can probably reuse this code to display the HTML for
 the 'favorites' and 'my stories'
 ********************************************************/
function navBarSubmit(evt) {
  console.debug("navBarClickSubmit", evt);
  hidePageComponents();
  $storiesContainer.show();
}

function navFavorite(evt) {
  console.debug("navBarCickFavorite", evt);
  hidePageComponents();
  console.log(currentUser.favorites)
  let favoriteStory = new Story ()
  const favorites = generateStoryMarkup(currentUser.favorites);
  $favoriteStoriesList.append(favorites);

  $favoriteStoriesList.show();
}

$navFavorites.on('click', navFavorite);

$navSubmitSory.on('click', navBarSubmit);
// Removed the console log we used for troubleshooting here ****
/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
};

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


