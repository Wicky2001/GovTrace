import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Guest, Admin } from "./db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = String(process.env.SECRET);

passport.use(
  "guest-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        console.log("guest local passport");
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

passport.use(
  "admin-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        console.log("Attempting to authenticate with email:", email);
        const admin = await Admin.findOne({ email: email });

        console.log(admin);

        if (!admin) {
          return done(null, false, { message: "INCORRECT EMAIL" });
        }

        return done(null, admin, { message: "admin login complete" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: jwtSecret,
// };

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      console.log("headers:", req.headers);
      console.log("cookies:", req.cookies); // Log cookies to see what's being sent
      return req.cookies.accessToken; // Extract accessToken from cookies
    }, // Assuming the cookie is named "accessToken"
  ]),
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
