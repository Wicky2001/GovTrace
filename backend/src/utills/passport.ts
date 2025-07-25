import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Guest } from "./db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = String(process.env.SECRET);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const guest = await Guest.findOne({ email: email });

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
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const guest = Guest.findOne({ email: payload.email });
      if (!guest) {
        return done(null, false, {
          message: "jwt authentication faild no user found",
        });
      }

      return done(null, guest, { message: "jwt authentication complete" });
    } catch (err) {
      return done(err);
    }
  })
);

export default passport;
