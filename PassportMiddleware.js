"use strict";

/**
 * Passport middleware configuration function.
 *
 * @alias puzzle.passport.PassportMiddleware
 * @memberOf puzzle.passport
 */
module.exports = () => {
  puzzle.http.use(puzzle.passport.initialize());
  puzzle.http.use(puzzle.passport.session());
};
