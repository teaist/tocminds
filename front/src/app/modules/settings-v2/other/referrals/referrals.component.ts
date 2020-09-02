import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-settingsV2__referrals',
  templateUrl: 'referrals.component.html',
})
export class SettingsV2ReferralsComponent implements OnInit {
  constructor(
    public session: Session,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }
  }
}
