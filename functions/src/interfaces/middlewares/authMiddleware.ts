import passport from "passport";
import PassportJwt from "passport-jwt";
// eslint-disable-next-line max-len
import {AccessTokenFirestore} from "../../infrastructure/firestore/accessTokenFirestore";

const opts = {
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "atom_secret",
};
passport.use(new PassportJwt.Strategy(opts, async (payload, done) => {
  const accessTokenFirestore = new AccessTokenFirestore();
  return done(null, await accessTokenFirestore.validToken(payload.token.id));
}));

const passportAuthenticate = passport.authenticate("jwt", {session: false});

export {passportAuthenticate};
