import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { AttachmentService } from '../../../../../services/attachment';
import { TranslationService } from '../../../../../services/translation';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { BoostCreatorComponent } from '../../../../boost/creator/creator.component';
import { EntitiesService } from '../../../../../common/services/entities.service';
import { Router } from '@angular/router';
import { BlockListService } from '../../../../../common/services/block-list.service';
import { ElementVisibilityService } from '../../../../../common/services/element-visibility.service';
import { NewsfeedService } from '../../../../newsfeed/services/newsfeed.service';
import { AutocompleteSuggestionsService } from '../../../../suggestions/services/autocomplete-suggestions.service';
import { ActivityService } from '../../../../../common/services/activity.service';
import { FeaturesService } from '../../../../../services/features.service';
import isMobile from '../../../../../helpers/is-mobile';
import { MindsVideoPlayerComponent } from '../../../../media/components/video-player/player.component';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { RedirectService } from '../../../../../common/services/redirect.service';
import { ComposerService } from '../../../../composer/services/composer.service';
import { ModalService } from '../../../../composer/components/modal/modal.service';
import { WireModalService } from '../../../../wire/wire-modal.service';
import { WireEventType } from '../../../../wire/v2/wire-v2.service';
import { ClientMetaDirective } from '../../../../../common/directives/client-meta.directive';
import { ActivityModalCreatorService } from '../../../../newsfeed/activity/modal/modal-creator.service';

@Component({
  selector: 'minds-activity',
  host: {
    class: 'mdl-card m-border',
  },
  inputs: [
    'object',
    'commentsToggle',
    'focusedCommentGuid',
    'visible',
    'canDelete',
    'showRatingToggle',
  ],
  providers: [
    ElementVisibilityService,
    ActivityService,
    ComposerService,
    ModalService,
  ],
  templateUrl: 'activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Activity implements OnInit {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;

  activity: any;
  boosted: boolean = false;
  commentsToggle: boolean = false;
  shareToggle: boolean = false;
  deleteToggle: boolean = false;
  translateToggle: boolean = false;
  translateEvent: EventEmitter<any> = new EventEmitter();
  showBoostOptions: boolean = false;
  allowComments = true;
  @Input() boost: boolean = false;
  @Input() disableBoosting: boolean = false;
  @Input() disableReminding: boolean = false;
  @Input('boost-toggle')
  @Input()
  showBoostMenuOptions: boolean = false;
  @Input() slot: number = -1;

  visibilityEvents: boolean = true;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input('visibilityEvents') set _visibilityEvents(visibilityEvents: boolean) {
    this.visibilityEvents = visibilityEvents;

    if (this.activityAnalyticsOnViewService) {
      this.activityAnalyticsOnViewService.setEnabled(this.visibilityEvents);
    }
  }

  type: string;
  element: any;
  visible: boolean = false;

  @Input() editing: boolean = false;
  @Input() hideTabs: boolean;

  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() commentsOpened: EventEmitter<any> = new EventEmitter();
  @Input() focusedCommentGuid: string;

  childEventsEmitter: EventEmitter<any> = new EventEmitter();
  @Output()
  onViewed: EventEmitter<{ activity; visible }> = new EventEmitter<{
    activity;
    visible;
  }>();

  isTranslatable: boolean;
  canDelete: boolean = false;
  showRatingToggle: boolean = false;

  blockedUsers: string[] = [];

  videoDimensions: Array<any> = null;

  protected payModalEventSubscription: Subscription;

  get menuOptions(): Array<string> {
    if (!this.activity || !this.activity.ephemeral) {
      if (this.showBoostMenuOptions) {
        return [
          'edit',
          'translate',
          'share',
          'follow',
          'feature',
          'delete',
          'report',
          'set-explicit',
          'block',
          'rating',
          'allow-comments',
        ];
      } else {
        return [
          'edit',
          'translate',
          'share',
          'follow',
          'feature',
          'delete',
          'report',
          'set-explicit',
          'block',
          'rating',
          'allow-comments',
        ];
      }
    } else {
      return [
        'view',
        'translate',
        'share',
        'follow',
        'feature',
        'report',
        'set-explicit',
        'block',
        'rating',
        'allow-comments',
      ];
    }
  }

  player: MindsVideoPlayerComponent;

  @ViewChild('player') set _player(player: MindsVideoPlayerComponent) {
    this.player = player;
  }

  @ViewChild('batchImage') batchImage: ElementRef;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  protected time_created: any;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public translationService: TranslationService,
    private overlayModal: OverlayModalService,
    private cd: ChangeDetectorRef,
    private entitiesService: EntitiesService,
    private router: Router,
    protected blockListService: BlockListService,
    protected activityAnalyticsOnViewService: ElementVisibilityService,
    protected newsfeedService: NewsfeedService,
    protected featuresService: FeaturesService,
    public suggestions: AutocompleteSuggestionsService,
    protected activityService: ActivityService,
    private elementRef: ElementRef,
    private configs: ConfigsService,
    private redirectService: RedirectService,
    protected composer: ComposerService,
    protected composerModal: ModalService,
    protected payModal: WireModalService,
    protected injector: Injector,
    private activityModalCreator: ActivityModalCreatorService
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    this.loadBlockedUsers();
  }

  ngAfterViewInit() {
    this.activityAnalyticsOnViewService
      .setElementRef(this.elementRef)
      .setEnabled(this.visibilityEvents)
      .onView(activity => {
        this.newsfeedService.recordView(
          activity,
          true,
          null,
          this.clientMeta.build({
            campaign: activity.boosted_guid ? activity.urn : '',
            position: this.slot,
          })
        );

        this.onViewed.emit({ activity: activity, visible: true });
      });
  }

  ngOnDestroy() {
    if (this.payModalEventSubscription) {
      this.payModalEventSubscription.unsubscribe();
    }
  }

  set object(value: any) {
    if (!value) return;
    this.activity = value;
    this.activity.url = this.siteUrl + 'newsfeed/' + value.guid;

    this.activityAnalyticsOnViewService.setEntity(this.activity);

    if (
      this.activity.custom_type === 'batch' &&
      this.activity.custom_data &&
      this.activity.custom_data[0].src
    ) {
      this.activity.custom_data[0].src = this.activity.custom_data[0].src.replace(
        this.configs.get('site_url'),
        this.configs.get('cdn_url')
      );
    }

    if (!this.activity.message) {
      this.activity.message = '';
    }

    if (!this.activity.title) {
      this.activity.title = '';
    }

    this.boosted = this.activity.boosted || this.activity.p2p_boosted;

    this.isTranslatable =
      this.translationService.isTranslatable(this.activity) ||
      (this.activity.remind_object &&
        this.translationService.isTranslatable(this.activity.remind_object));

    this.activity.time_created =
      this.activity.time_created || Math.floor(Date.now() / 1000);

    this.allowComments = this.activity.allow_comments;

    this.activityAnalyticsOnViewService.checkVisibility(); // perform check
    this.detectChanges();
  }

  getOwnerIconTime() {
    const session = this.session.getLoggedInUser();
    if (session && session.guid === this.activity.ownerObj.guid) {
      return session.icontime;
    } else {
      return this.activity.ownerObj.icontime;
    }
  }

  @Input() set boostToggle(toggle: boolean) {
    //if(toggle)
    //  this.showBoost();
    return;
  }

  save() {
    console.log('trying to save your changes to the server', this.activity);
    this.editing = false;
    this.activity.edited = true;
    this.activity.time_created =
      this.activity.time_created || Math.floor(Date.now() / 1000);

    let data = this.activity;
    if (this.attachment.has()) {
      data = Object.assign(this.activity, this.attachment.exportMeta());
    }
    this.client.post('api/v1/newsfeed/' + this.activity.guid, data);
  }

  delete($event: any = {}) {
    if ($event.inProgress) {
      $event.inProgress.emit(true);
    }
    this.client
      .delete(`api/v1/newsfeed/${this.activity.guid}`)
      .then((response: any) => {
        if ($event.inProgress) {
          $event.inProgress.emit(false);
          $event.completed.emit(0);
        }
        this.deleted.emit(this.activity);
      })
      .catch(e => {
        if ($event.inProgress) {
          $event.inProgress.emit(false);
          $event.completed.emit(1);
        }
      });
  }

  /*async setSpam(value: boolean) {
    this.activity['spam'] = value;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/spam/${this.activity.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/spam/${this.activity.guid}`);
      }
    } catch (e) {
      this.activity['spam'] = !value;
    }
  }

  async setDeleted(value: boolean) {
    this.activity['deleted'] = value;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/delete/${this.activity.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/delete/${this.activity.guid}`);
      }
    } catch (e) {
      this.activity['delete'] = !value;
    }
  }*/

  openComments() {
    if (!this.shouldShowComments()) {
      return;
    }
    this.commentsToggle = !this.commentsToggle;
    this.commentsOpened.emit(this.commentsToggle);
  }

  async togglePin() {
    if (this.session.getLoggedInUser().guid != this.activity.owner_guid) {
      return;
    }

    this.activity.pinned = !this.activity.pinned;
    const url: string = `api/v2/newsfeed/pin/${this.activity.guid}`;
    try {
      if (this.activity.pinned) {
        await this.client.post(url);
      } else {
        await this.client.delete(url);
      }
    } catch (e) {
      this.activity.pinned = !this.activity.pinned;
    }
  }

  async showBoost() {
    let activity = this.activity;

    if (activity.ephemeral) {
      activity = await this.entitiesService.single(activity.entity_guid);

      if (!activity) {
        throw new Error('Invalid entity');
      }
    }

    const boostModal = this.overlayModal.create(
      BoostCreatorComponent,
      activity
    );

    boostModal.onDidDismiss(() => {
      this.showBoostOptions = false;
    });

    boostModal.present();
  }

  async showWire() {
    if (this.session.getLoggedInUser().guid !== this.activity.owner_guid) {
      let activity = this.activity;

      if (activity.ephemeral) {
        activity = await this.entitiesService.single(activity.entity_guid);

        if (!activity) {
          throw new Error('Invalid entity');
        }
      }

      const entity = activity.remind_object ? activity.remind_object : activity;

      this.payModalEventSubscription = this.payModal
        .present(entity)
        .subscribe(payEvent => {
          if (payEvent.type === WireEventType.Completed) {
            this.wireSubmitted(payEvent.payload);
          }
        });
    }
  }

  async wireSubmitted(wire?) {
    if (wire && this.activity.wire_totals) {
      this.activity.wire_totals.tokens =
        parseFloat(this.activity.wire_totals.tokens) +
        wire.amount * Math.pow(10, 18);

      this.detectChanges();
    }
  }

  menuOptionSelected(option: string) {
    switch (option) {
      case 'view':
        this.router.navigate(['/newsfeed', this.activity.guid]);
        break;
      case 'edit':
        this.composer.load(this.activity);

        this.composerModal
          .setInjector(this.injector)
          .present()
          .toPromise()
          .then(activity => {
            if (activity) {
              this.activity = activity;
              this.detectChanges();
            }
          });

        break;
      case 'delete':
        this.delete();
        break;
      case 'set-explicit':
        this.setExplicit(true);
        break;
      case 'remove-explicit':
        this.setExplicit(false);
        break;
      case 'translate':
        this.translateToggle = true;
        break;
    }
    this.detectChanges();
  }

  setExplicit(value: boolean) {
    const oldValue = this.activity.mature,
      oldMatureVisibility = this.activity.mature_visibility;

    this.activity.mature = value;
    this.activity.mature_visibility = void 0;

    if (this.activity.custom_data && this.activity.custom_data[0]) {
      this.activity.custom_data[0].mature = value;
    } else if (this.activity.custom_data) {
      this.activity.custom_data.mature = value;
    }

    this.client
      .post(`api/v1/entities/explicit/${this.activity.guid}`, {
        value: value ? '1' : '0',
      })
      .catch(e => {
        this.activity.mature = oldValue;
        this.activity.mature_visibility = oldMatureVisibility;

        if (this.activity.custom_data && this.activity.custom_data[0]) {
          this.activity.custom_data[0].mature = oldValue;
        } else if (this.activity.custom_data) {
          this.activity.custom_data.mature = oldValue;
        }
      });
  }

  onNSWFSelections(reasons: Array<{ value; label; selected }>) {
    if (this.attachment.has()) {
      this.attachment.setNSFW(reasons);
    }
    this.activity.nsfw = reasons.map(reason => reason.value);
  }

  isUnlisted() {
    return this.activity.access_id === '0' || this.activity.access_id === 0;
  }

  propagateTranslation($event) {
    if (
      this.activity.remind_object &&
      this.translationService.isTranslatable(this.activity.remind_object)
    ) {
      this.childEventsEmitter.emit({
        action: 'translate',
        args: [$event],
      });
    }
  }

  hide() {
    if (this.player) {
      this.player.pause();
    }
  }

  async loadBlockedUsers() {
    try {
      this.blockedUsers = (await this.blockListService.getList()) || [];
      this.detectChanges();
    } catch (e) {
      console.warn('Activity.loadBlockedUsers', e);
    }

    return true;
  }

  isOwnerBlocked(activity) {
    return activity && this.blockedUsers.indexOf(activity.owner_guid) > -1;
  }

  isPending(activity) {
    return activity && activity.pending && activity.pending !== '0';
  }

  isScheduled(time_created, deviation = 5000) {
    // Scheduled when time_created is more than 5 (default) seconds in the
    // future, to account minimal client computer deviation.

    return time_created && time_created * 1000 > Date.now() + deviation;
  }

  toggleMatureVisibility() {
    this.activity.mature_visibility = !this.activity.mature_visibility;

    if (this.activity.remind_object) {
      // this.activity.remind_object.mature_visibility = !this.activity.remind_object.mature_visibility;

      this.activity.remind_object = Object.assign(
        {},
        {
          ...this.activity.remind_object,
          mature_visibility: !this.activity.remind_object.mature_visibility,
        }
      );
    }

    this.detectChanges();
  }

  onRemindMatureVisibilityChange() {
    this.activity.mature_visibility = !this.activity.mature_visibility;
  }

  shouldShowComments() {
    return this.activity.allow_comments || this.activity['comments:count'] >= 0;
  }

  setVideoDimensions($event) {
    this.videoDimensions = $event.dimensions;
    this.activity.custom_data.dimensions = this.videoDimensions;
  }

  setImageDimensions() {
    const img: HTMLImageElement = this.batchImage.nativeElement;
    this.activity.custom_data[0].width = img.naturalWidth;
    this.activity.custom_data[0].height = img.naturalHeight;
  }

  clickedImage() {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;
    const pageUrl = `/media/${this.activity.entity_guid}`;

    if (isMobile() && isNotTablet) {
      this.router.navigate([pageUrl]);
      return;
    }

    if (!this.featuresService.has('media-modal')) {
      this.router.navigate([pageUrl]);
      return;
    } else {
      if (
        this.activity.custom_data[0].width === '0' ||
        this.activity.custom_data[0].height === '0'
      ) {
        this.setImageDimensions();
      }
      this.openModal();
    }
  }

  onRichEmbedClick(e: Event): void {
    if (
      this.activity.perma_url &&
      this.activity.perma_url.indexOf(this.configs.get('site_url')) === 0
    ) {
      this.redirectService.redirect(this.activity.perma_url);
      return; // Don't open modal for minds links
    }

    this.openModal();
  }

  openModal() {
    this.activityModalCreator.create(this.activity, this.injector);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  onTimeCreatedChange(newDate) {
    this.activity.time_created = newDate;
  }

  posterDateSelectorError(msg) {
    throw new Error(msg);
  }

  getTimeCreated() {
    return this.activity.time_created > Math.floor(Date.now() / 1000)
      ? this.activity.time_created
      : null;
  }

  checkCreated() {
    return this.activity.time_created > Math.floor(Date.now() / 1000)
      ? true
      : false;
  }

  /**
   * Determined whether boost button should be shown.
   * @returns { boolean } true if boost button should be shown.
   */
  showBoostButton(): boolean {
    return (
      this.session.getLoggedInUser().guid == this.activity.owner_guid &&
      !this.isScheduled(this.activity.time_created) &&
      !this.disableBoosting
    );
  }

  /**
   * Determined whether remind button should be shown.
   * @returns { boolean } true if remind button should be shown.
   */
  showRemindButton(): boolean {
    return (
      !this.isScheduled(this.activity.time_created) && !this.disableReminding
    );
  }
}
