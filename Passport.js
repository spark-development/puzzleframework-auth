"use strict";

const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const authHdr = require("passport-jwt/lib/auth_header");

const { ExtractJwt, Strategy } = passportJWT;

const tokenExtractor = (req) => {
  let authParams = authHdr.parse(req.headers.authorization);
  if (authParams && authParams.scheme.toLowerCase() === "bearer") {
    return authParams.value;
  }

  authParams = ExtractJwt.fromUrlQueryParameter("token")(req);
  return authParams || "";
};

/**
 * Passport authentication functionality configuration function.
 *
 * @alias puzzle.passport.Passport
 * @memberOf puzzle.passport
 */
module.exports = (fetchUserCallback) => {
  /**
   * Passport configuration object.
   *
   * @see puzzle.config.auth
   *
   * @var {Object}
   */
  const config = {
    secretOrKey: puzzle.config.auth.jwtSecret,
    jwtFromRequest: tokenExtractor,
    issuer: puzzle.config.auth.issuer,
    audience: puzzle.config.auth.audience,
    ignoreExpiration: false
  };

  /**
   * Define which authentication strategy should be used.
   */
  passport.use(new Strategy(
    config,
    (async (payload, done) => {
      try {
        done(null, await fetchUserCallback(payload));
      } catch (e) {
        done(e, null);
      }
    })
  ));

  /**
   * Reference to Passport authentication system.
   *
   * @alias puzzle.passport
   * @type {Passport}
   */
  puzzle.set("passport", passport);

  /**
   * JWT methods used to perform some actions on a JWT token.
   *
   * @alias puzzle.passport.jwt
   * @type {Object}
   */
  puzzle.passport.jwt = {
    /**
     * Signs in a user with the given payload.
     *
     * @memberOf puzzle.passport.jwt
     * @param {Object} payload The payload to authenticate.
     * @param {boolean} rememberMe Should the token be remembered for a longer period.
     *
     * @return {string|Object}
     */
    sign(payload, rememberMe = false) {
      return jwt.sign(payload, config.secretOrKey, {
        audience: config.audience,
        issuer: config.issuer,
        expiresIn: rememberMe ? "1y" : "1d"
      });
    },

    /**
     * Verifies if the given token is valid or not.
     *
     * @memberOf puzzle.passport.jwt
     * @param {string} token The token to be verified.
     *
     * @return {boolean}
     */
    verify(token) {
      return token !== "" && jwt.verify(token, config.secretOrKey, {
        audience: config.audience,
        issuer: config.issuer
      });
    },

    /**
     * Decodes the given token.
     *
     * @memberOf puzzle.passport.jwt
     * @param {string} token The token to be token.
     *
     * @return {string|Object}
     */
    decode(token) {
      return jwt.decode(token);
    },

    /**
     * Extracts the authentication information from the request object.
     *
     * @memberOf puzzle.passport.jwt
     * @param {Object} req The request object.
     *
     * @return {string|Object}
     */
    extractor(req) {
      return tokenExtractor(req);
    }
  };

  /**
   * Reference to authentication method.
   *
   * @alias puzzle.auth
   * @type {function}
   */
  puzzle.set("auth", passport.authenticate("jwt", puzzle.config.auth.jwtSession));
};
