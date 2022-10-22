"use strict";
// This is the global list of the stories, an instance of StoryList
let storyList;

//values from inputs for new story submission saved in easy to find variables for function
const storySubBtn = $('#save-story')

//takes values from story form inputs to create story object to pass into function to create story OBJECT
async function assembleStory() {
  const title = $('#title').val();
  const author = $('#auth').val();
  const url = $('#url').val();
  const newStory = {title : title, author : author, url : url, username : localStorage.username} 
  return await storyList.addStory(newStory)
}

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

async function storySubClick(evt) {
  $storyForm.hide()
  const story = await assembleStory();
  $('#title').val('')
  $('#auth').val('')
  $('#url').val('')
  // here is has become a promise issue has to be inside of assemble story
  await storyList.sendStory(story);
  getAndShowStoriesOnStart();
}

$('#saveStory').on('click', storySubClick)

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

  $allStoriesList.show();
}
