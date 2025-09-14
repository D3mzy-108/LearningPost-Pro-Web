// export const DOMAIN = "http://localhost:2002";
export const DOMAIN = "https://api.learningpost.ng";
export const LOGIN_URL = `${DOMAIN}/professional/professional-login/`;
export const SIGNUP_URL = `${DOMAIN}/professional/professional-signup/`;
export const UPDATE_PRO_USER_PROFILE_URL = `${DOMAIN}/professional/user-profile/update/`;
export const JOIN_ORGANIZATION_URL = `${DOMAIN}/professional/add-learning-track/`;
export const LEARNING_TRACKS = (username: string) => {
  return `${DOMAIN}/professional/get-learning-tracks/${username}/`;
};

// QUEST URLS
export const PRO_QUESTS_URL = (username: string, trackCode: string) => {
  return `${DOMAIN}/professional/get-quests/${username}/?code=${trackCode}`;
};
export const GET_QUEST_QUESTIONS = (testId: string, username: string) => {
  return `${DOMAIN}/api/quest/${testId}/get-questions/${username}/?count=30`;
};
export const SAVE_PROGRESS = (
  questionIds: string[] | number[],
  username: string
) => {
  const questionidsStr = questionIds.join(",");
  return `${DOMAIN}/api/question/${questionidsStr}/answered/${username}/`;
};
export const SAVE_PERFORMANCE = (username: string) => {
  return `${DOMAIN}/api/save-performance/${username}/`;
};

// BOOKEE URLS
export const PRO_BOOKS_URL = (username: string, trackCode: string) => {
  return `${DOMAIN}/professional/get-books/${username}/?code=${trackCode}`;
};
export const BOOK_CHAPTERS_URL = (username: string, bookId: string) => {
  return `${DOMAIN}/api/${username}/book/${bookId}/chapters/`;
};

// TEST URLS
export const PRO_TESTS_URL = (username: string, trackCode: string) => {
  return `${DOMAIN}/professional/get-tests/${username}/?code=${trackCode}`;
};
export const START_TEST = (testId: string, username: string) => {
  return `${DOMAIN}/professional/start-test/${testId}/${username}/`;
};
export const SAVE_TEST_SCORE = (testId: string, username: string) => {
  return `${DOMAIN}/professional/save-test-score/${username}/${testId}/`;
};
export const GET_TEST_ATTEMPT = (testId: string, username: string) => {
  return `${DOMAIN}/professional/get-test-attempt/${username}/${testId}/`;
};
export const REQUEST_SMARTLINK_URL = (username: string) => {
  return `${DOMAIN}/akada/smartlink/${username}/`;
};
