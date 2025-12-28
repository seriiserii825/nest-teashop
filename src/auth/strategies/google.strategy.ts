import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Google OAuth environment variables are not defined in .env',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL, // Fixed: no extra path
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string, // Added missing parameter
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;

    if (!emails?.length || !photos?.length || !name) {
      return done(new Error('No sufficient information from Google account'));
    }

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}

// http://localhost:3344/auth/google/callback
