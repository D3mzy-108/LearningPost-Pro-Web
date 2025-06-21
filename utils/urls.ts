export const DOMAIN = "http://localhost:2002";
// DOMAIN="https://api.learningpost.ng";
export const LOGIN_URL = `${DOMAIN}/professional/professional-login/`;
export const JOIN_ORGANIZATION_URL = `${DOMAIN}/professional/join-organization/`;
export const PRO_QUESTS_URL = (username: string) => {
  return `${DOMAIN}/professional/get-quests/${username}/`;
};
export const PRO_BOOKS_URL = (username: string) => {
  return `${DOMAIN}/professional/get-books/${username}/`;
};
export const PRO_TESTS_URL = (username: string) => {
  return `${DOMAIN}/professional/get-tests/${username}/`;
};
export const BOOK_CHAPTERS_URL = (username: string, bookId: string) => {
  return `${DOMAIN}/api/${username}/book/${bookId}/chapters/`;
};
export const GET_QUEST_QUESTIONS = (testId: string, username: string) => {
  return `${DOMAIN}/api/quest/${testId}/get-questions/${username}/`;
};
