# Puzzle Framework Authentication Module

Authentication module to be used together with Puzzle Framework.

To use this module, you will have to add the following code in your authentication module,
in the "afterBoot" method of the module initialization class.

<pre>
const passport = require("@puzzleframework/auth/Passport");
const passportMiddleware = require("@puzzleframework/auth/PassportMiddleware");
...
afterBoot() {
  ...
  passport(<method used to fetch user>);
  passportMiddleware();
  ...
}
...
</pre>

For example, to fetch the user you can add the following method in the same class.

<pre>
/**
 * Fetches the correct user based on the payload read from the
 * JWT token.
 *
 * @param {Object} payload The JWT Payload.
 *
 * @return {User}
 */
fetchUser(payload) {
  const User = puzzle.models.get("User");
  return User.findOne({
    where: {
      id: payload.id  
    }
  });
}
</pre>
