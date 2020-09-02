import { Component } from '@angular/core';
import { Client } from '../../../../services/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  EntitiesService,
  EntityObservable,
} from '../../../../common/services/entities.service';
import { last, first, catchError } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { FastFadeAnimation } from '../../../../animations';
import { DiscoveryService } from '../../discovery.service';
import { PaywallService } from '../../../wire/v2/paywall.service';

@Component({
  selector: 'm-discovery__trend',
  templateUrl: './trend.component.html',
  animations: [FastFadeAnimation],
  providers: [PaywallService],
})
export class DiscoveryTrendComponent {
  entity$: Observable<Object> = of(null);
  paramSubscription: Subscription;

  constructor(
    private entitiesService: EntitiesService,
    private route: ActivatedRoute,
    private discoveryService: DiscoveryService,
    private paywallService: PaywallService
  ) {}

  ngOnInit() {
    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.loadEntity(params.get('guid'));
      }
    );
  }

  loadEntity(guid: string): void {
    if (this.discoveryService.isPlusPage$.getValue() === true) {
      // Auto unlock
      this.entity$ = this.paywallService.unlock(guid).pipe(
        catchError(err => {
          // Fallback to the raw entity if we have an error (eg. not subscribed to plus)
          return this.loadEntityFromEntitiesService(guid);
        })
      );
    } else {
      this.entity$ = this.loadEntityFromEntitiesService(guid);
    }
  }

  loadEntityFromEntitiesService(guid: string): EntityObservable {
    return this.entitiesService.single(`urn:entity:${guid}`);
  }
}
