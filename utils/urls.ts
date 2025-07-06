export const DOMAIN = "http://localhost:2002";
// export const DOMAIN = "https://api.learningpost.ng";
export const LOGIN_URL = `${DOMAIN}/professional/professional-login/`;
export const SIGNUP_URL = `${DOMAIN}/professional/professional-signup/`;
export const JOIN_ORGANIZATION_URL = `${DOMAIN}/professional/add-learning-track/`;
export const LEARNING_TRACKS = (username: string) => {
  return `${DOMAIN}/professional/get-learning-tracks/${username}/`;
};
export const PRO_QUESTS_URL = (username: string, trackCode: string) => {
  return `${DOMAIN}/professional/get-quests/${username}/?code=${trackCode}`;
};
export const PRO_BOOKS_URL = (username: string, trackCode: string) => {
  return `${DOMAIN}/professional/get-books/${username}/?code=${trackCode}`;
};
export const PRO_TESTS_URL = (username: string, trackCode: string) => {
  return `${DOMAIN}/professional/get-tests/${username}/?code=${trackCode}`;
};
export const BOOK_CHAPTERS_URL = (username: string, bookId: string) => {
  return `${DOMAIN}/api/${username}/book/${bookId}/chapters/`;
};
export const GET_QUEST_QUESTIONS = (testId: string, username: string) => {
  return `${DOMAIN}/api/quest/${testId}/get-questions/${username}/`;
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
export const GET_TEST_QUESTIONS = (testId: string) => {
  return `${DOMAIN}/professional/get-test-questions/${testId}/`;
};
export const SAVE_TEST_SCORE = (testId: string, username: string) => {
  return `${DOMAIN}/professional/save-score/${username}/${testId}/`;
};
export const GET_TEST_SCORE = (testId: string, username: string) => {
  return `${DOMAIN}/professional/get-score/${username}/${testId}/`;
};
