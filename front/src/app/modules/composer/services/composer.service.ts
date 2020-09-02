import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ActivityEntity } from '../../newsfeed/activity/activity.service';
import { RichEmbed, RichEmbedService } from './rich-embed.service';
import { Attachment, AttachmentService } from './attachment.service';
import { AttachmentPreviewResource, PreviewService } from './preview.service';
import { VideoPoster } from './video-poster.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { SupportTier } from '../../wire/v2/support-tiers.service';
import parseHashtagsFromString from '../../../helpers/parse-hashtags';

/**
 * Message value type
 */
export type MessageSubjectValue = string;

/**
 * Default message value
 */
export const DEFAULT_MESSAGE_VALUE: MessageSubjectValue = '';

/**
 * Title value type
 */
export type TitleSubjectValue = string | null;

/**
 * Default title value
 */
export const DEFAULT_TITLE_VALUE: MessageSubjectValue = null;

/**
 * Attachment value type
 */
export type AttachmentSubjectValue = File | Attachment | null;

/**
 * Attachment resolved object value (used for payload)
 */
export type AttachmentMetadataMappedValue = Attachment | null;

/**
 * Default attachment value
 */
export const DEFAULT_ATTACHMENT_VALUE: AttachmentSubjectValue = null;

/**
 * Default videoposter value
 */
export const DEFAULT_VIDEOPOSTER_VALUE: VideoPoster = null;

/**
 * Rich embed value type
 */
export type RichEmbedSubjectValue = RichEmbed | string | null;

/**
 * Rich embed resolved object value (used for payload)
 */
export type RichEmbedMetadataMappedValue = RichEmbed | null;

/**
 * Default rich embed value
 */
export const DEFAULT_RICH_EMBED_VALUE: RichEmbedSubjectValue = null;

/**
 * NSFW value type
 */
export type NsfwSubjectValue = Array<number>;

/**
 * Default NSFW value
 */
export const DEFAULT_NSFW_VALUE: NsfwSubjectValue = [];

/**
 * Monetization value type
 */
export type MonetizationSubjectValue = {
  type?: 'tokens' | 'money';
  min?: number;
  support_tier?: {
    urn: string;
    expires?: number;
    usd?: number;
    has_tokens?: boolean;
  };
} | null;

/**
 * Default monetization value
 */
export const DEFAULT_MONETIZATION_VALUE: MonetizationSubjectValue = null;

/**
 * Pending monetization value type
 */
export type PendingMonetizationSubjectValue = {
  type: 'plus' | 'membership' | 'custom';
  support_tier: {
    urn: string;
    expires?: number;
    usd?: number;
    has_tokens?: boolean;
  };
} | null;

/**
 * Default pending monetization value
 */
export const DEFAULT_PENDING_MONETIZATION_VALUE: PendingMonetizationSubjectValue = null;

/**
 * Tags value type
 */
export type TagsSubjectValue = Array<string>;

/**
 * Default tags value
 */
export const DEFAULT_TAGS_VALUE: TagsSubjectValue = [];

/**
 * Schedule value type
 */
export type ScheduleSubjectValue = number | null;

/**
 * Default schedule value
 */
export const DEFAULT_SCHEDULE_VALUE: ScheduleSubjectValue = null;

/**
 * Access ID value type
 */
export type AccessIdSubjectValue = string;

/**
 * Default access ID value
 */
export const DEFAULT_ACCESS_ID_VALUE: AccessIdSubjectValue = '2';

/**
 * License value type
 */
export type LicenseSubjectValue = string;

/**
 * Default license value
 */
export const DEFAULT_LICENSE_VALUE: LicenseSubjectValue = 'all-rights-reserved';

/**
 * Payload data object. Used to build the DTO
 */
export interface Data {
  message: MessageSubjectValue;
  title: TitleSubjectValue;
  nsfw: NsfwSubjectValue;
  monetization: MonetizationSubjectValue;
  tags: TagsSubjectValue;
  schedule: ScheduleSubjectValue;
  accessId: AccessIdSubjectValue;
  license: LicenseSubjectValue;
  attachment: AttachmentMetadataMappedValue;
  richEmbed: RichEmbedMetadataMappedValue;
  videoPoster: VideoPoster;
}

/**
 * Store/process class for activities composer. As it's used as a store it should be injected individually
 * on the components that require it using `providers` array.
 */
@Injectable()
export class ComposerService implements OnDestroy {
  /**
   * Message subject
   */
  readonly message$: BehaviorSubject<MessageSubjectValue> = new BehaviorSubject<
    MessageSubjectValue
  >(DEFAULT_MESSAGE_VALUE);

  /**
   * Title subject
   */
  readonly title$: BehaviorSubject<TitleSubjectValue> = new BehaviorSubject<
    TitleSubjectValue
  >(DEFAULT_TITLE_VALUE);

  /**
   * NSFW subject
   */
  readonly nsfw$: BehaviorSubject<NsfwSubjectValue> = new BehaviorSubject<
    NsfwSubjectValue
  >(DEFAULT_NSFW_VALUE);

  /**
   * Monetization subject
   */
  monetization$: BehaviorSubject<
    MonetizationSubjectValue
  > = new BehaviorSubject<MonetizationSubjectValue>(DEFAULT_MONETIZATION_VALUE);

  /**
   * Pending monetization subject
   */
  readonly pendingMonetization$: BehaviorSubject<
    PendingMonetizationSubjectValue
  > = new BehaviorSubject<PendingMonetizationSubjectValue>(
    DEFAULT_PENDING_MONETIZATION_VALUE
  );

  /**
   * Tags subject
   */
  readonly tags$: BehaviorSubject<TagsSubjectValue> = new BehaviorSubject<
    TagsSubjectValue
  >(DEFAULT_TAGS_VALUE);

  /**
   * Schedule subject
   */
  readonly schedule$: BehaviorSubject<
    ScheduleSubjectValue
  > = new BehaviorSubject<ScheduleSubjectValue>(DEFAULT_SCHEDULE_VALUE);

  /**
   * Access ID subject
   */
  readonly accessId$: BehaviorSubject<
    AccessIdSubjectValue
  > = new BehaviorSubject<AccessIdSubjectValue>(DEFAULT_ACCESS_ID_VALUE);

  /**
   * License subject
   */
  readonly license$: BehaviorSubject<LicenseSubjectValue> = new BehaviorSubject<
    LicenseSubjectValue
  >(DEFAULT_LICENSE_VALUE);

  /**
   * Attachment subject
   */
  readonly attachment$: BehaviorSubject<
    AttachmentSubjectValue
  > = new BehaviorSubject<AttachmentSubjectValue>(DEFAULT_ATTACHMENT_VALUE);

  /**
   * Video Poster subject
   */
  videoPoster$: BehaviorSubject<VideoPoster> = new BehaviorSubject(null);

  /**
   * Rich embed subject
   */
  readonly richEmbed$: BehaviorSubject<
    RichEmbedSubjectValue
  > = new BehaviorSubject<RichEmbedSubjectValue>(DEFAULT_RICH_EMBED_VALUE);

  /**
   * Preview subject (state)
   */
  readonly attachmentPreview$: BehaviorSubject<AttachmentPreviewResource | null> = new BehaviorSubject<AttachmentPreviewResource | null>(
    null
  );

  /**
   * Preview subject (state)
   */
  readonly richEmbedPreview$: BehaviorSubject<RichEmbed | null> = new BehaviorSubject<RichEmbed | null>(
    null
  );

  /**
   * In progress flag subject (state)
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Current progress subject (state)
   */
  readonly progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Is posting flag subject (state)
   */
  readonly isPosting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Attachment error subject (state)
   */
  readonly attachmentError$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  /**
   * Post-ability check subject (state)
   */
  readonly canPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Is this an edit operation? (state)
   */
  readonly isEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Are we currently moving part of this service's state to another place? (i.e. blog editor)
   */
  readonly isMovingContent$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Too many tags subject
   */
  readonly tooManyTags$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Tag count subject
   */
  readonly tagCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * URL in the message
   */
  readonly messageUrl$: Observable<string>;

  /**
   * Data structure observable
   */
  readonly data$: Observable<Data>;

  /**
   * Subscription to data structure observable
   */
  protected readonly dataSubscription: Subscription;

  /**
   * Subscription to pending monetization observable
   */
  protected readonly pendingMonetizationSubscription: Subscription;

  /**
   * Subscription to a rich embed extractor observable
   */
  protected readonly richEmbedExtractorSubscription: Subscription;

  /**
   * Container GUID for this instance
   */
  protected containerGuid: string | null = null;

  /**
   * If we're editing, this holds a clone of the original activity
   */
  public entity: any = null;

  /**
   * Current payload to be consumed by DTO builder
   */
  protected payload: any = null;

  /**
   * Sets up data observable and its subscription
   *
   * @param api
   * @param attachment
   * @param richEmbed
   * @param preview
   */
  constructor(
    protected api: ApiService,
    protected attachment: AttachmentService,
    protected richEmbed: RichEmbedService,
    protected preview: PreviewService,
    protected feedsUpdate: FeedsUpdateService
  ) {
    // Setup data stream using the latest subject values
    // This should emit whenever any subject changes.

    this.data$ = combineLatest<
      [
        MessageSubjectValue,
        TitleSubjectValue,
        NsfwSubjectValue,
        MonetizationSubjectValue,
        TagsSubjectValue,
        ScheduleSubjectValue,
        AccessIdSubjectValue,
        LicenseSubjectValue,
        AttachmentMetadataMappedValue,
        RichEmbedMetadataMappedValue,
        VideoPoster
      ]
    >([
      this.message$.pipe(distinctUntilChanged()),
      this.title$.pipe(distinctUntilChanged()),
      this.nsfw$, // TODO: Implement custom distinctUntilChanged comparison
      this.monetization$, // TODO: Implement custom distinctUntilChanged comparison
      this.tags$, // TODO: Implement custom distinctUntilChanged comparison
      this.schedule$, // TODO: Implement custom distinctUntilChanged comparison
      this.accessId$.pipe(
        distinctUntilChanged(),
        tap(accessId => {
          // This will trigger a warning about an illegal access ID operation
          if (this.containerGuid && this.containerGuid !== accessId) {
            console.warn(
              "Access ID will be overriden by container's GUID",
              this.containerGuid
            );
          }
        })
      ),
      this.license$.pipe(distinctUntilChanged()),
      this.attachment$.pipe(
        // Only react to attachment changes from previous values (string -> File -> null -> File -> ...)
        distinctUntilChanged(),

        // On every attachment change:
        tap(file => {
          // - Reset attachment error string
          this.attachmentError$.next('');

          // - Set the preview based the current value (Blob URL or empty)
          this.setPreview(file);
        }),

        // Call the engine endpoints to upload the file
        this.attachment.resolve(
          () => ({ containerGuid: this.getContainerGuid() }),
          // - Update inProgress and progress state subjects
          (inProgress, progress) => this.setProgress(inProgress, progress),

          // - Handle errors and update attachmentErrors subject
          e => {
            console.error('Composer:Attachment', e); // Ensure Sentry knows
            this.attachmentError$.next(
              (e && e.message) || 'There was an issue uploading your file'
            );
          }
        ),

        tap(() => this.inProgress$.next(null))

        // Value will be either an Attachment interface object or null
      ),
      this.richEmbed$.pipe(
        // Only react to rich-embed URL changes
        distinctUntilChanged(),

        // Call the engine endpoint to resolve the URL, debouncing the request to avoid server overload
        this.richEmbed.resolve(200),

        // Update the preview
        tap((richEmbed: RichEmbed) => this.richEmbedPreview$.next(richEmbed))

        // Value will be either a RichEmbed interface object or null
      ),
      this.videoPoster$.pipe(distinctUntilChanged()),
    ]).pipe(
      map(
        // Create an JSON object based on an array of Subject values
        ([
          message,
          title,
          nsfw,
          monetization,
          tags,
          schedule,
          accessId,
          license,
          attachment,
          richEmbed,
          videoPoster,
        ]) => ({
          message,
          title,
          nsfw,
          monetization,
          tags,
          schedule,
          accessId,
          license,
          attachment,
          richEmbed,
          videoPoster,
        })
      ),
      tap(values => {
        const bodyTags = parseHashtagsFromString(values.message).concat(
          parseHashtagsFromString(values.title)
        );

        const tagCount = bodyTags.length + values.tags.length;

        this.tagCount$.next(tagCount);

        const tooManyTags = tagCount > 5;

        this.tooManyTags$.next(tooManyTags);

        this.canPost$.next(
          Boolean(
            !tooManyTags &&
              (values.message || values.attachment || values.richEmbed)
          )
        );
      })
    );

    // Subscribe to data stream and re-build API payload when it changes

    this.dataSubscription = this.data$.subscribe(data =>
      this.buildPayload(data)
    );

    // Subscribe to pending monetization and format monetization$
    this.pendingMonetizationSubscription = this.pendingMonetization$.subscribe(
      pendingMonetization => {
        if (pendingMonetization) {
          this.monetization$.next({
            support_tier: pendingMonetization.support_tier,
          });
        } else {
          this.monetization$.next(null);
        }
      }
    );

    // Subscribe to message and extract any URL it finds
    this.messageUrl$ = this.message$.pipe(
      map(message => this.richEmbed.extract(message))
    );

    // Subscribe to message URL and rich embed in order to know if a URL should be resolved

    this.richEmbedExtractorSubscription = combineLatest([
      this.messageUrl$.pipe(distinctUntilChanged()),
      this.richEmbed$.pipe(distinctUntilChanged()),
    ])
      .pipe(debounceTime(500))
      .subscribe(([messageUrl, richEmbed]) => {
        // Use current message URL when:
        // a) there's no rich embed already set; or
        // b) rich embed's type is a string (locally extracted); or
        // c) loaded activity don't have the entity GUID set (which mean is a blog)
        //
        // It won't emit an empty extraction to allow keeping embeds when deleting text
        // thanks to debounceTime pipe above.
        //
        // Be very careful, as it depends on the same observable we're modifying
        if (
          !richEmbed ||
          typeof richEmbed === 'string' ||
          !richEmbed.entityGuid
        ) {
          if (!this.canEditMetadata()) {
            return;
          }

          if (messageUrl) {
            this.richEmbed$.next(messageUrl);
          }
        }
      });
  }

  /**
   * Runs when dependant component is destroyed
   */
  ngOnDestroy(): void {
    this.tearDown();
  }

  /**
   * Destroys the service and its state
   */
  tearDown(): void {
    // Reset state and free resources
    this.reset();

    // Unsubscribe to data stream
    this.dataSubscription.unsubscribe();

    // Unsubscribe from pending monetization
    this.pendingMonetizationSubscription.unsubscribe();

    // Unsubscribe from rich embed extractor
    this.richEmbedExtractorSubscription.unsubscribe();
  }

  /**
   * Sets the container GUID for this instance
   * @param containerGuid
   */
  setContainerGuid(containerGuid: string | null) {
    this.containerGuid = containerGuid || null;
    return this;
  }

  /**
   * Gets the container GUID for this instance
   */
  getContainerGuid(): string | null {
    return this.containerGuid || null;
  }

  /**
   * Resets composer data and state
   */
  reset(): void {
    // Reset data
    this.message$.next(DEFAULT_MESSAGE_VALUE);
    this.title$.next(DEFAULT_TITLE_VALUE);
    this.nsfw$.next(DEFAULT_NSFW_VALUE);
    this.monetization$.next(DEFAULT_MONETIZATION_VALUE);
    this.tags$.next(DEFAULT_TAGS_VALUE);
    this.schedule$.next(DEFAULT_SCHEDULE_VALUE);
    this.accessId$.next(DEFAULT_ACCESS_ID_VALUE);
    this.license$.next(DEFAULT_LICENSE_VALUE);
    this.attachment$.next(DEFAULT_ATTACHMENT_VALUE);
    this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
    this.videoPoster$.next(DEFAULT_VIDEOPOSTER_VALUE);

    // Reset state
    this.inProgress$.next(false);
    this.progress$.next(0);
    this.isPosting$.next(false);
    this.attachmentError$.next('');
    this.isEditing$.next(false);
    this.isMovingContent$.next(false);

    // Reset preview (state + blob URL)
    this.setPreview(null);

    // Reset rich embed preview
    this.richEmbedPreview$.next(null);

    // Reset original source
    this.entity = null;
  }

  /**
   * Loads an activity from API payload
   *
   * @param activity
   */
  load(activity: any) {
    if (!activity) {
      return;
    }

    this.reset();

    // Save a clone of the original activity that was loaded
    this.entity = JSON.parse(JSON.stringify(activity));

    // Build the fields
    const message = activity.message || DEFAULT_MESSAGE_VALUE;
    const title = activity.title || DEFAULT_TITLE_VALUE;
    const nsfw = activity.nsfw || DEFAULT_NSFW_VALUE;
    const monetization = activity.wire_threshold || DEFAULT_MONETIZATION_VALUE;
    const tags = activity.tags || DEFAULT_TAGS_VALUE;
    const schedule =
      activity.time_created && activity.time_created * 1000 > Date.now() + 15000
        ? activity.time_created
        : null;
    const accessId =
      activity.access_id !== null
        ? activity.access_id
        : DEFAULT_ACCESS_ID_VALUE;
    const license = activity.license || DEFAULT_LICENSE_VALUE;

    // Build attachment and rich embed data structure

    let attachment: AttachmentSubjectValue = DEFAULT_ATTACHMENT_VALUE;
    let richEmbed: RichEmbedSubjectValue = DEFAULT_RICH_EMBED_VALUE;
    let videoPoster: VideoPoster;

    if (activity.custom_type === 'batch') {
      attachment = {
        type: 'image',
        guid: activity.entity_guid,
      } as Attachment;
    } else if (activity.custom_type === 'video') {
      attachment = {
        type: 'video',
        guid: activity.entity_guid,
      } as Attachment;
      videoPoster = { url: activity.custom_data.thumbnail_src };
    } else if (activity.entity_guid || activity.perma_url) {
      // Rich embeds (blogs included)
      richEmbed = {
        entityGuid: activity.entity_guid || null,
        url: activity.perma_url,
        title: activity.title || '',
        description: activity.blurb || '',
        thumbnail: activity.thumbnail_src || '',
      };
    }

    // Priority service state elements

    this.attachment$.next(attachment);
    this.richEmbed$.next(richEmbed);
    this.videoPoster$.next(videoPoster);

    // Apply them to the service state

    this.message$.next(message);
    this.title$.next(title);
    this.nsfw$.next(nsfw);
    this.monetization$.next(monetization);
    this.tags$.next(tags);
    this.schedule$.next(schedule);
    this.accessId$.next(accessId);
    this.license$.next(license);

    // Define container

    if (typeof activity.container_guid !== 'undefined') {
      this.setContainerGuid(activity.containerGuid);
    }

    this.isEditing$.next(true);
  }

  /**
   * Updates the preview. Frees resources, if needed.
   * @param attachment
   */
  setPreview(attachment: AttachmentSubjectValue) {
    const currentPreview = this.attachmentPreview$.getValue();

    if (currentPreview) {
      this.preview.prune(currentPreview);
    }

    this.attachmentPreview$.next(this.preview.build(attachment));
  }

  /**
   * Deletes the current attachment, if any
   */
  removeAttachment() {
    if (!this.canEditMetadata()) {
      return;
    }

    const payload = this.payload;

    // Clean up attachment ONLY if the new entity GUID is different from the original source, if any
    if (payload.entity_guid && !this.isOriginalEntity(payload.entity_guid)) {
      this.attachment.prune(payload.entity_guid);
    }

    this.attachment$.next(null);
    this.videoPoster$.next(null);
    this.title$.next(null);
  }

  /**
   * Deletes the current rich embed
   */
  removeRichEmbed(): void {
    if (!this.canEditMetadata()) {
      return;
    }

    this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
  }

  /**
   * Used to prevent original entity deletion when editing an activity. That operation is handled in the engine.
   * @param entityGuid
   */
  protected isOriginalEntity(entityGuid): boolean {
    if (!this.entity || typeof this.entity.entity_guid === 'undefined') {
      return false;
    }

    return (entityGuid || '') === (this.entity.entity_guid || '');
  }

  /**
   * Can metadata be edited? Only if the original activity doesn't have both a URL and an entity_guid, or it's not a remind
   */
  canEditMetadata(): boolean {
    if (!this.entity) {
      return true;
    } else if (this.entity.remind_object) {
      return false;
    }

    return !this.entity.perma_url || !this.entity.entity_guid;
  }

  /**
   * Builds the API payload and sets to a property
   * @param message
   * @param title
   * @param attachment
   * @param nsfw
   * @param monetization
   * @param tags
   * @param accessId
   * @param license
   * @param schedule
   * @param richEmbed
   * @param videoPoster
   */
  buildPayload({
    message,
    title,
    nsfw,
    monetization,
    tags,
    schedule,
    accessId,
    license,
    attachment,
    richEmbed,
    videoPoster,
  }: Data): any {
    if (this.containerGuid) {
      // Override accessId if there's a container set
      accessId = this.containerGuid;
    }

    this.payload = {
      message: message || '',
      wire_threshold: monetization || null,
      paywall: Boolean(monetization),
      time_created: schedule || null,
      mature: nsfw && nsfw.length > 0,
      nsfw: nsfw || [],
      tags: tags || [],
      access_id: accessId,
      license: license,
    };

    const attachmentGuid = (attachment && attachment.guid) || null;

    if (this.canEditMetadata()) {
      if (attachmentGuid) {
        this.payload.entity_guid = attachmentGuid;
        this.payload.title = title;
        this.payload.is_rich = false;
        this.payload.entity_guid_update = true;
      } else if (richEmbed && !richEmbed.entityGuid) {
        this.payload.url = richEmbed.url;
        this.payload.title = richEmbed.title;
        this.payload.description = richEmbed.description;
        this.payload.thumbnail = richEmbed.thumbnail;
        this.payload.is_rich = true;

        if (!this.isOriginalEntity(richEmbed.entityGuid)) {
          this.payload.entity_guid_update = true;
        }
      } else if (!this.isOriginalEntity(null)) {
        this.payload.entity_guid_update = true;
      }
    }

    if (this.containerGuid) {
      this.payload.container_guid = this.containerGuid;
    }

    if (videoPoster && videoPoster.fileBase64) {
      this.payload.video_poster = videoPoster.fileBase64;
    }
  }

  /**
   * Sets the current progress state
   *
   * @param inProgress
   * @param progress
   * @private
   */
  setProgress(inProgress: boolean, progress: number = 1): void {
    this.inProgress$.next(inProgress);
    this.progress$.next(progress);
  }

  /**
   * Posts a new activity
   */
  async post(): Promise<ActivityEntity> {
    this.isPosting$.next(true);
    this.setProgress(true);

    // New activity
    let endpoint = `api/v2/newsfeed`;

    let editing = this.entity && this.entity.guid;
    if (editing) {
      endpoint = `api/v2/newsfeed/${this.entity.guid}`;
    }

    try {
      const { activity } = await this.api
        .post(endpoint, this.payload)
        .toPromise();

      // Provide an update to subscribing feeds.
      if (!editing) {
        this.feedsUpdate.postEmitter.emit(activity);
      }

      this.reset();
      this.isPosting$.next(false);
      this.setProgress(false);

      activity.boostToggle = true;
      return activity;
    } catch (e) {
      this.isPosting$.next(false);
      this.setProgress(false);
      throw e; // Re-throw
    }
  }
}
