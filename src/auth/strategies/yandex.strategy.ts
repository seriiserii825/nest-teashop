import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';

type DoneCallback = (error: Error | null, user?: any) => void;

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor() {
    const clientID = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;
    const callbackURL = process.env.YANDEX_CALLBACK_URL;

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Google OAuth environment variables are not defined in .env',
      );
    }
    super({
      clientID,
      clientSecret,
      callbackURL: callbackURL + '/auth/yandex/callback',
    });
  }

  validate(accessToken: string, profile: Profile, done: DoneCallback) {
    const { username, emails, photos } = profile;
    if (
      !emails ||
      emails.length === 0 ||
      !photos ||
      photos.length === 0 ||
      !username
    ) {
      throw new Error('Invalid Yandex OAuth profile data');
    }
    const user = {
      email: emails[0].value,
      username,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
