"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const showStar = currentUser ? true : false;
  // Updated to display a star for favorite functionality
  return $(`
      <li id="${story.storyId}">
        ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//Make favorite/not-favorite star for story
function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? 'fas' : 'far';
  return `<span class="star">
            <i class="fa-star ${starType}"></i>
          </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.trigger("reset");
  $allStoriesList.show();
}

async function getFormData(evt) {
  // added console.debug log & page refresh prevention here
  console.debug("getFormData");
  evt.preventDefault();

  const $createAuthor = $('#create-author').val();
  const $createTitle = $('#create-title').val();
  const $createUrl = $('#create-url').val();
  // We had this in caps || so it pointed to the blank class function instead of the current instance
  const newStory = await storyList.addStory(currentUser,
    { author: $createAuthor, title: $createTitle, url: $createUrl });
  storyList.stories.unshift(newStory);
  // Pass the story var into the generateStoryMarkup function
  let $story = generateStoryMarkup(newStory);
  // Add the story to the top of the list
  $allStoriesList.prepend($story);
  // reset the form after displaying it again
  $submitForm.show();
  $submitForm.trigger("reset");
}

$submitForm.on('submit', getFormData);



async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}
$storiesLists.on("click", ".star", toggleStoryFavorite);