import passport from "passport";
import PassportJwt from "passport-jwt";
import {AccessTokenFirestore}
  from "../../infrastructure/firestore/accessTokenFirestore";

/**
 * Options for configuring Passport JWT authentication strategy.
 * - `jwtFromRequest`: Extracts the JWT token fromthe Authorization header
 * as a Bearer token.
 * - `secretOrKey`: The secret key used to decode the JWT token.
 */
const opts = {
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "atom_secret",
};
/**
 * Sets up the Passport JWT strategy with the defined options.
 * Verifies the validity of the provided token using Firestore's
 * AccessTokenFirestore.
 */
passport.use(new PassportJwt.Strategy(opts, async (payload, done) => {
  const accessTokenFirestore = new AccessTokenFirestore();
  return done(null, await accessTokenFirestore.validToken(payload.token.id));
}));

/**
 * Middleware that authenticates requests using the Passport JWT strategy.
 * Ensures that the request is authenticated without creating a session.
 */
const passportAuthenticate = passport.authenticate("jwt", {session: false});

/**
 * Exports the Passport JWT authentication middleware for use in other parts
 * of the application.
 */
export {passportAuthenticate};
