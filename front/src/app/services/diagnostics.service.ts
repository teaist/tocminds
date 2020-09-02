import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { Session } from './session';
import { environment } from '../../environments/environment';
import { ConfigsService } from '../common/services/configs.service';

@Injectable()
export class DiagnosticsService {
  readonly environment: string;
  constructor(protected session: Session, configs: ConfigsService) {
    this.environment = configs.get('environment');
    Sentry.init({
      dsn: 'https://3f786f8407e042db9053434a3ab527a2@sentry.io/1538008', // TODO: do not hardcard
      release: environment.version,
      environment: this.environment,
      ignoreErrors: [
        /request was interrupted by a call to/i,
        /executing a cancelled action/i,
        /AbortError: The fetching process for the media resource/i,
        /AbortError: The operation was aborted./i,
        /AbortError: The play\(\) request was interrupted by a new load request./i,
        /NotAllowedError: play\(\) can only be initiated by a user gesture./i,
        'RangeError',
      ],
    });
  }

  listen() {
    this.session.getLoggedInUser(currentUser => {
      this.setUser(currentUser);
    });
  }

  setUser(currentUser) {
    let userId = null;

    if (currentUser) {
      userId = currentUser.guid || null;
    }

    Sentry.setUser({
      id: userId,
    });

    console.info(
      `Diagnostics ID: ${userId} | Environment: ${this.environment}`
    );
  }
}
