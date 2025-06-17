export const DOMAIN = "http://localhost:2002";
// export const DOMAIN = "https://api.learningpost.ng";
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
