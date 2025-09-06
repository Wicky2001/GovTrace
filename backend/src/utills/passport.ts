import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Guest, Admin } from "./db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = String(process.env.SECRET);
const google_client_id = String(process.env.GOOGLE_CLIENT_ID);
const google_client_secret = String(process.env.GOOGLE_CLIENT_SECRET);

passport.use(
  "guest-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        // console.log("guest local passport");
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
        // console.log("Attempting to authenticate with email:", email);
        const admin = await Admin.findOne({ email: email });

        // console.log(admin);

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

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      // console.log("headers:", req.headers);
      // console.log("cookies:", req.cookies); // Log cookies to see what's being sent
      return req.cookies.accessToken;
    },
  ]),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      // Check if the JWT payload has an email
      if (payload.email) {
        // If the payload has an email (from JWT authentication), check if the user exists
        const guest = await Guest.findOne({ email: payload.email });

        if (!guest) {
          return done(null, false, {
            message: "JWT authentication failed, no user found",
          });
        }

        return done(null, guest, { message: "JWT authentication complete" });
      }

      // If no email is found, handle Google OAuth case (where `payload` might have `googleId` instead)
      else if (payload.googleId) {
        // If the user logged in via Google OAuth, find the user by Google ID
        const guest = await Guest.findOne({ googleId: payload.googleId });

        if (!guest) {
          return done(null, false, {
            message:
              "JWT authentication failed, no user found for Google OAuth",
          });
        }

        return done(null, guest, {
          message: "Google OAuth authentication complete",
        });
      }

      // If neither email nor googleId is found in the payload, reject
      return done(null, false, { message: "Invalid JWT payload" });
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: google_client_id,
      clientSecret: google_client_secret,
      callbackURL: "https://localhost:4000/api/auth/google/callback",
    },
    //The below code only invoked in auth/google/callback this url
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Guest.findOne({ googleId: profile.id });

        console.log(`user data from goole = ${JSON.stringify(profile)}`);
        if (!user) {
          user = await Guest.create({
            googleId: profile.id,
            email: profile.email,
            password: "google o aut",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
