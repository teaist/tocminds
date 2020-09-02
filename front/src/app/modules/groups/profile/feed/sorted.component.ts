import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../../newsfeed/poster/poster.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { Session } from '../../../../services/session';
import { SortedService } from './sorted.service';
import { Client } from '../../../../services/api/client';
import { GroupsService } from '../../groups.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComposerComponent } from '../../../composer/composer.component';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-group-profile-feed__sorted',
  providers: [SortedService, FeedsService],
  templateUrl: 'sorted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupProfileFeedSortedComponent implements OnInit {
  group: any;

  @Input('group') set _group(group: any) {
    if (group === this.group) {
      return;
    }

    this.group = group;

    if (this.initialized) {
      this.load(true);
    }
  }

  type: string = 'activities';

  @Input('type') set _type(type: string) {
    if (type === this.type) {
      return;
    }

    this.type = type;

    if (this.initialized) {
      this.load(true);
    }
  }

  pinned: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: any = '';

  initialized: boolean = false;

  kicking: any;

  viewScheduled: boolean = false;

  @ViewChild('poster') protected poster: PosterComponent;

  @ViewChild('composer') private composer: ComposerComponent;

  scheduledCount: number = 0;

  feed$: Observable<BehaviorSubject<Object>[]>;

  constructor(
    protected service: GroupsService,
    public feedsService: FeedsService,
    protected sortedService: SortedService,
    protected session: Session,
    protected router: Router,
    protected client: Client,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialized = true;
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (!refresh) {
      return;
    }

    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    let endpoint = 'api/v2/feeds/container';
    if (this.viewScheduled) {
      endpoint = 'api/v2/feeds/scheduled';
    }

    try {
      this.feedsService
        .setEndpoint(`${endpoint}/${this.group.guid}/${this.type}`)
        .setLimit(12)
        .fetch();

      this.feed$ = this.feedsService.feed.pipe(
        map(feed => {
          const entities = [];

          for (let i = 0; i < feed.length; i++) {
            const entity: any = feed[i].getValue();
            entity.dontPin = !(
              this.group['is:moderator'] || this.group['is:owner']
            );
            entities.push(new BehaviorSubject<Object>(entity));
          }
          return entities;
        })
      );

      this.getScheduledCount();
    } catch (e) {
      console.error('GroupProfileFeedSortedComponent.loadFeed', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  loadMore() {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  setFilter(type: string) {
    const route = ['/groups/profile', this.group.guid, 'feed'];

    if (type !== 'activities') {
      route.push(type);
    }

    this.router.navigate(route);
  }

  isMember() {
    return this.session.isLoggedIn() && this.group['is:member'];
  }

  isActivityFeed() {
    return this.type === 'activities';
  }

  prepend(activity: any) {
    if (!activity || !this.isActivityFeed()) {
      return;
    }

    let feedItem = {
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    };

    this.feedsService.rawFeed.next([
      ...[feedItem],
      ...this.feedsService.rawFeed.getValue(),
    ]);

    this.detectChanges();
  }

  delete(activity) {
    this.feedsService.deleteItem(activity, (item, obj) => {
      return item.guid === obj.guid;
    });

    this.detectChanges();
  }

  //

  protected v1CanDeactivate(): boolean {
    if (!this.poster || !this.poster.attachment) {
      return true;
    }

    const progress = this.poster.attachment.getUploadProgress();

    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }

    // Check v1 Poster component
    return this.v1CanDeactivate();
  }

  /**
   * Sets the value of kick, triggering the kick modal.
   *
   * @param Observable entity - entity triggering the removal
   * @returns void
   */
  kick(entity: Observable<Object>): void {
    // programmatic piping as cannot use pipes in the click event.
    if (!entity) {
      this.kicking = null;
      return;
    }
    const asyncPipe: AsyncPipe = new AsyncPipe(this.cd);
    const userValue: Object = asyncPipe.transform(entity);
    this.kicking = userValue['ownerObj'];
  }

  //

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleScheduled() {
    this.viewScheduled = !this.viewScheduled;
    this.load(true);
  }

  async getScheduledCount() {
    const url = `api/v2/feeds/scheduled/${this.group.guid}/count`;
    const response: any = await this.client.get(url);
    this.scheduledCount = response.count;
    this.detectChanges();
  }
}
