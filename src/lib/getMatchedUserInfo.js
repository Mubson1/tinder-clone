//users contains all the details of both users who have matched and userLoggedIn is the ID of the current user(me)
const getMatchedUserInfo = (users, userLoggedIn) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];

  //we are destructuring to get the user id and their details. Additional information is given below:
  const [id, user] = Object.entries(newUsers).flat();

  return { id, ...user };
};

export default getMatchedUserInfo;

/**
 * initially the newUsers without the loggedIn user details will be like an object that looks like this:
 *  {
 *      {
 *
 *      }
 * }
 *
 * Then, by doing Object.entries(newUsers), we are getting key-value pairs with new Users
 * At last, .flat() is used to convert the above object structure to below object structure (single dimensional array):
 *  [id, {<user-object>}]
 *
 */
