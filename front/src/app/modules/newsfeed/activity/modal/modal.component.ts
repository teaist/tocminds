import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  Self,
} from '@angular/core';
import { Location } from '@angular/common';
import { Event, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { SlowFadeAnimation } from '../../../../animations';
import { ActivityService, ActivityEntity } from '../activity.service';
import { FeaturesService } from '../../../../services/features.service';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { AnalyticsService } from '../../../../services/analytics';
import { TranslationService } from '../../../../services/translation';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { SiteService } from '../../../../common/services/site.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ClientMetaService } from '../../../../common/services/client-meta.service';
import { AttachmentService } from '../../../../services/attachment';
import isFullscreen, { toggleFullscreen } from '../../../../helpers/fullscreen';
import { ComposerService } from '../../../composer/services/composer.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../../common/services/activity.service';
import { ActivityModalService } from './modal.service';
import { HorizontalFeedService } from '../../../../common/services/horizontal-feed.service';
import { MediaModalParams } from '../../../media/modal/modal.component';

// Constants of dimensions calculations
export const ACTIVITY_MODAL_MIN_STAGE_HEIGHT = 520;
export const ACTIVITY_MODAL_MIN_STAGE_WIDTH = 660;
export const ACTIVITY_MODAL_CONTENT_WIDTH = 360;
export const ACTIVITY_MODAL_PADDING = 40; // 20px on each side
export const ACTIVITY_MODAL_WIDTH_EXCL_STAGE =
  ACTIVITY_MODAL_CONTENT_WIDTH + ACTIVITY_MODAL_PADDING;

@Component({
  selector: 'm-activity__modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.ng.scss'],
  animations: [
    SlowFadeAnimation, // Fade media in after load
  ],
  providers: [
    ActivityService,
    ActivityModalService,
    ComposerService,
    ActivityServiceCommentsLegacySupport,
  ],
})
export class ActivityModalComponent implements OnInit, OnDestroy {
  @Input('entity') set data(params: MediaModalParams) {
    this.service.setActivityService(this.activityService);

    this.service.setSourceUrl(this.router.url);

    this.service.setEntity(params.entity);

    this.activityService.setDisplayOptions({
      showOnlyCommentsInput: false,
      isModal: true,
      fixedHeight: false,
    });

    // Prepare pager
    this.horizontalFeed.setBaseEntity(params.entity);
  }

  private readonly allowedActivityTypes = [
    // No status posts or reminds
    'rich-embed', // includes blogs
    'video',
    'image',
  ];

  entity: ActivityEntity;
  entitySubscription: Subscription;
  routerSubscription: Subscription;
  fullscreenSubscription: Subscription;
  canonicalUrlSubscription: Subscription;

  // Used for backdrop click detection hack
  isOpen: boolean = false;
  isOpenTimeout: any = null;

  pagerTimeout: any = null;
  navigatedAway: boolean = false;

  /**
   * Dimensions
   */
  maxHeight: number;

  stageWidth: number;
  stageHeight: number;
  maxStageWidth: number;

  mediaWidth: number;
  mediaHeight: number;

  entityWidth: number = 0;
  entityHeight: number = 0;

  isPaywall2020: boolean = false;

  constructor(
    @Self() public activityService: ActivityService,
    public client: Client,
    public session: Session,
    public analyticsService: AnalyticsService,
    public translationService: TranslationService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private location: Location,
    private site: SiteService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    protected clientMetaService: ClientMetaService,
    public attachment: AttachmentService,
    public service: ActivityModalService,
    private horizontalFeed: HorizontalFeedService,
    private features: FeaturesService
  ) {}

  /////////////////////////////////////////////////////////////////
  // SETUP
  /////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    // Prevent dismissal of modal when it's just been opened
    this.isOpenTimeout = setTimeout(() => (this.isOpen = true), 20);

    this.isPaywall2020 = this.features.has('paywall-2020');

    this.entitySubscription = this.activityService.entity$.subscribe(
      (entity: ActivityEntity) => {
        /**
         * Modal doesn't handle reminds or status posts
         */

        if (!entity) {
          return;
        }

        if (
          entity.activity_type &&
          !this.allowedActivityTypes.includes(entity.activity_type)
        ) {
          // TODO this should go to next activity in horizontal feed instead
          this.service.dismiss();
        }

        this.entity = entity;
        this.calculateDimensions();
      }
    );

    this.canonicalUrlSubscription = this.activityService.canonicalUrl$.subscribe(
      canonicalUrl => {
        if (!this.entity) return;
        /**
         * Record pageviews
         */
        let url = `${canonicalUrl}?ismodal=true`;

        if (this.site.isProDomain) {
          url = `/pro/${this.site.pro.user_guid}${url}`;
        }
        this.clientMetaService.recordView(this.entity, this.parentClientMeta, {
          source: 'single',
          medium: 'modal',
        });

        this.analyticsService.send('pageview', {
          url,
        });
        /**
         * Change the url to point to media page so user can easily share link
         * (but don't actually redirect)
         */
        this.location.replaceState(canonicalUrl);
      }
    );

    // When user clicks a link from inside the modal
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (!this.navigatedAway) {
          this.navigatedAway = true;

          // Fix browser history so back button doesn't go to media page
          this.service.returnToSourceUrl();

          // Go to the intended destination
          this.router.navigate([event.url]);

          this.service.dismiss();
        }
      }
    });

    this.fullscreenSubscription = this.service.isFullscreen$.subscribe(
      isFullscreen => {
        this.calculateDimensions();
      }
    );
  }

  /**
   * Re-calculate height/width when window resizes
   *
   */
  @HostListener('window:resize', ['$resizeEvent'])
  onResize(resizeEvent) {
    this.calculateDimensions();
  }

  /////////////////////////////////////////////////////////////////
  // OVERLAY & PAGER VISIBILITY
  /////////////////////////////////////////////////////////////////

  /**
   * Show overlay and pager
   */
  onMouseEnterStage() {
    this.service.overlayVisible$.next(true);
    this.service.pagerVisible$.next(true);
    if (this.pagerTimeout) {
      clearTimeout(this.pagerTimeout);
    }
  }

  /**
   * Hide overlay and pager
   */
  onMouseLeaveStage() {
    this.service.overlayVisible$.next(false);
    this.service.pagerVisible$.next(false);
    this.pagerTimeout = setTimeout(() => {
      this.service.pagerVisible$.next(false);
    }, 2000);
  }

  /////////////////////////////////////////////////////////////////
  // FULLSCREEN LISTENER
  /////////////////////////////////////////////////////////////////
  /**
   * Listen for fullscreen change event in case
   * user enters/exits full screen without clicking the icon
   */
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullscreenChange(event) {
    this.service.isFullscreen$.next(isFullscreen());
    this.calculateDimensions();
  }

  /////////////////////////////////////////////////////////////////
  // MODAL DISMISSAL
  /////////////////////////////////////////////////////////////////

  // Dismiss modal when backdrop is clicked and modal is open
  @HostListener('document:click', ['$event'])
  clickedBackdrop($event) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (this.isOpen) {
      this.service.dismiss();
    }
  }

  // Don't dismiss modal if click somewhere other than backdrop
  clickedModal($event) {
    $event.stopPropagation();
  }

  /////////////////////////////////////////////////////////////////
  // KEYBOARD SHORTCUTS
  /////////////////////////////////////////////////////////////////

  @HostListener('window:keydown', ['$event']) onWindowKeyDown(
    $event: KeyboardEvent
  ): Boolean {
    if (!this.service.shouldFilterOutKeyDownEvent($event)) {
      if ($event.key === 'Escape' && this.isOpen) {
        this.service.dismiss();
      }
    }
    return true;
  }

  ngOnDestroy() {
    if (this.entitySubscription) {
      this.entitySubscription.unsubscribe();
    }

    if (this.canonicalUrlSubscription) {
      this.canonicalUrlSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.fullscreenSubscription) {
      this.fullscreenSubscription.unsubscribe();
    }

    if (this.isOpenTimeout) {
      clearTimeout(this.isOpenTimeout);
    }

    // If the modal was closed without a redirect, replace media page url
    // with original source url and fix browser history so back button
    // doesn't go to media page
    if (!this.navigatedAway) {
      this.service.returnToSourceUrl();
    }
  }

  /////////////////////////////////////////////////////////////////
  // DIMENSIONS CAlCULATIONS
  /////////////////////////////////////////////////////////////////

  // TODO de-spaghetti ლ(¯ロ¯"ლ)
  calculateDimensions() {
    if (!this.entity) {
      return;
    }

    /**
     * Get intrinsic dimensions
     */
    switch (this.entity.content_type) {
      case 'video':
      case 'rich-embed':
        this.entityWidth = this.entity.custom_data.dimensions
          ? this.entity.custom_data.dimensions.width
          : 1280;
        this.entityHeight = this.entity.custom_data.dimensions
          ? this.entity.custom_data.dimensions.height
          : 720;
        break;
      case 'image':
        this.entityWidth = this.entity.custom_data[0].width;
        this.entityHeight = this.entity.custom_data[0].height;
        break;
      case 'blog':
        this.entityWidth = window.innerWidth * 0.6;
        this.entityHeight = window.innerHeight * 0.6;
        break;
    }

    /**
     * NOT FULLSCREEN
     */
    if (!this.service.isFullscreen$.getValue()) {
      /**
       * NON-FULLSCREEN BLOG
       */
      if (this.entity.content_type === 'blog') {
        this.mediaHeight = Math.max(
          ACTIVITY_MODAL_MIN_STAGE_HEIGHT,
          this.aBitLessThan(window.innerHeight) - ACTIVITY_MODAL_PADDING
        );
        this.mediaWidth = Math.max(
          ACTIVITY_MODAL_MIN_STAGE_WIDTH,
          this.aBitLessThan(window.innerWidth) - ACTIVITY_MODAL_WIDTH_EXCL_STAGE
        );
        this.stageHeight = this.mediaHeight;
        this.stageWidth = this.mediaWidth;

        this.service.loading$.next(false);
        return;
      }

      this.setHeightsAsTallAsPossible();

      // After heights are set, check that scaled width isn't too wide or narrow
      this.maxStageWidth = Math.max(
        window.innerWidth -
          ACTIVITY_MODAL_CONTENT_WIDTH -
          ACTIVITY_MODAL_PADDING,
        ACTIVITY_MODAL_MIN_STAGE_WIDTH
      );

      if (this.mediaWidth >= this.maxStageWidth) {
        // Too wide :(
        this.rescaleHeightsForMaxWidth();
      } else if (
        this.mediaWidth >
        ACTIVITY_MODAL_MIN_STAGE_WIDTH - ACTIVITY_MODAL_PADDING
      ) {
        // Not too wide or too narrow :)
        this.stageWidth = this.mediaWidth;
      } else {
        // Too narrow :(
        // If black stage background is visible on left/right, each strip should be at least 20px wide
        this.stageWidth = ACTIVITY_MODAL_MIN_STAGE_WIDTH;
        // Continue to resize height after reaching min width
        this.handleNarrowWindow();
      }

      // If black stage background is visible on top/bottom, each strip should be at least 20px high
      const heightDiff = this.stageHeight - this.mediaHeight;
      if (0 < heightDiff && heightDiff <= ACTIVITY_MODAL_PADDING) {
        this.stageHeight += ACTIVITY_MODAL_PADDING;
      }
    } else {
      /**
       * IS FULLSCREEN
       */
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      this.stageWidth = windowWidth;
      this.stageHeight = windowHeight;

      switch (this.entity.content_type) {
        case 'blog':
          this.mediaHeight = windowHeight;
          this.mediaWidth = windowWidth;
          return;
        case 'image':
          // For images, set mediaHeight as tall as possible but not taller than instrinsic height
          this.mediaHeight =
            this.entityHeight < windowHeight ? this.entityHeight : windowHeight;
          break;
        case 'video':
          // It's ok if videos are taller than intrinsic height
          this.mediaHeight = windowHeight;
      }

      this.mediaWidth =
        this.entity.content_type === 'blog' ? windowWidth : this.scaleWidth();

      if (this.mediaWidth > windowWidth) {
        // Width was too wide, need to rescale heights so width fits
        this.mediaWidth = windowWidth;
        this.mediaHeight = this.scaleHeight();
      }
    }

    if (this.entity.content_type === 'video') {
      this.entityHeight = this.mediaHeight;
      this.entityWidth = this.mediaWidth;
    }

    this.service.loading$.next(false);
  }

  setHeightsAsTallAsPossible() {
    this.maxHeight = window.innerHeight - ACTIVITY_MODAL_PADDING;

    // Initialize stageHeight to be as tall as possible and not smaller than minimum
    this.stageHeight = Math.max(
      this.maxHeight,
      ACTIVITY_MODAL_MIN_STAGE_HEIGHT
    );

    // Set mediaHeight as tall as stage but no larger than intrinsic height
    if (
      this.entity.content_type !== 'video' &&
      this.entityHeight < this.stageHeight
    ) {
      // Image is shorter than stage; scale down stage
      this.mediaHeight = this.entityHeight;
      this.stageHeight = Math.max(
        this.mediaHeight,
        ACTIVITY_MODAL_MIN_STAGE_HEIGHT
      );
    } else {
      // Either: Image is taller than stage; scale it down so it fits inside stage
      // Or:     Video should be as tall as possible but not taller than stage
      this.mediaHeight = this.stageHeight;
    }

    // Scale width according to aspect ratio
    this.mediaWidth = this.scaleWidth();
  }

  rescaleHeightsForMaxWidth() {
    // Media is intrinsically too wide, set width to max and rescale heights
    this.mediaWidth = this.maxStageWidth;
    this.stageWidth = this.maxStageWidth;

    this.mediaHeight = this.scaleHeight();
    this.stageHeight = Math.max(
      this.mediaHeight,
      ACTIVITY_MODAL_MIN_STAGE_HEIGHT
    );
  }

  handleNarrowWindow() {
    // When at minStageWidth and windowWidth falls below threshold,
    // shrink vertically until it hits minStageHeight

    // When window is narrower than this, start to shrink height
    const verticalShrinkWidthThreshold =
      this.mediaWidth + ACTIVITY_MODAL_WIDTH_EXCL_STAGE;

    const widthDiff = verticalShrinkWidthThreshold - window.innerWidth;
    // Is window narrow enough to start shrinking vertically?
    if (widthDiff >= 1) {
      // What mediaHeight would be if it shrunk proportionally to difference in width
      const mediaHeightPreview = Math.round(
        (this.mediaWidth - widthDiff) / this.aspectRatio
      );

      // Shrink media if mediaHeight is still above min
      if (mediaHeightPreview > ACTIVITY_MODAL_MIN_STAGE_HEIGHT) {
        this.mediaWidth -= widthDiff;
        this.mediaHeight = this.scaleHeight();
        this.stageHeight = this.mediaHeight;
      } else {
        this.stageHeight = ACTIVITY_MODAL_MIN_STAGE_HEIGHT;
        this.mediaHeight = Math.min(
          ACTIVITY_MODAL_MIN_STAGE_HEIGHT,
          this.entityHeight
        );
        this.mediaWidth = this.scaleWidth();
      }
    }
  }

  scaleHeight() {
    return Math.round(this.mediaWidth / this.aspectRatio);
  }

  scaleWidth() {
    return Math.round(this.mediaHeight * this.aspectRatio);
  }

  aBitLessThan(number: number) {
    return number * 0.9;
  }
  ////////////////////////////////////////
  get aspectRatio(): number {
    return this.entityWidth / this.entityHeight;
  }

  get modalWidth(): number {
    return this.stageWidth + ACTIVITY_MODAL_CONTENT_WIDTH;
  }
}
