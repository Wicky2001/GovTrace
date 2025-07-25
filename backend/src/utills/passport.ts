import { Strategy as LocalStrategy } from "passport-local";

import passport from "passport";
import { Guest } from "./db.js";
import bcrypt from "bcryptjs";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const guest = await Guest.findOne({ email: username });

      if (!guest) {
        return done(null, false, { message: "INCORRECT EMAIL" });
      }

      const isPasswordMatch = await bcrypt.compare(password, guest.password);
      if (!isPasswordMatch) {
        return done(null, false, { message: "INCORRECT PASSWORD" });
      }

      return done(null, guest, { message: "Authentication complete" });
    } catch (err) {
      return done(err);
    }
  })
);

export default passport;
