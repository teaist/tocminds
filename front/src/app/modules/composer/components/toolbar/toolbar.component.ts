import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  Input,
} from '@angular/core';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  AttachmentSubjectValue,
  ComposerService,
  MonetizationSubjectValue,
  NsfwSubjectValue,
  TagsSubjectValue,
} from '../../services/composer.service';
import {
  FileUploadComponent,
  FileUploadSelectEvent,
} from '../../../../common/components/file-upload/file-upload.component';
import { ButtonComponentAction } from '../../../../common/components/button-v2/button.component';
import { PopupService } from '../popup/popup.service';
import { NsfwComponent } from '../popup/nsfw/nsfw.component';
import { MonetizeComponent } from '../popup/monetize/monetize.component';
import { TagsComponent } from '../popup/tags/tags.component';
import { ScheduleComponent } from '../popup/schedule/schedule.component';
import { isPlatformBrowser } from '@angular/common';

/**
 * Toolbar component. Interacts directly with the service.
 */
@Component({
  selector: 'm-composer__toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.ng.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * On Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<
    ButtonComponentAction
  > = new EventEmitter<ButtonComponentAction>();

  /**
   * Is the composer in a modal?
   */
  @Input() isModal: boolean = false;

  /**
   * Upload component ref
   */
  @ViewChild('fileUploadComponent')
  fileUploadComponent: FileUploadComponent;

  /**
   * Toolbar main <div> element
   */
  @ViewChild('toolbarWrapper', { static: true }) toolbarWrapper: ElementRef<
    HTMLDivElement
  >;

  /**
   * Show narrow style
   */
  narrow: boolean = true;

  /**
   * Window resize event observable
   */
  protected windowResize$: Subject<void> = new Subject<void>();

  /**
   * Window resize event subscription
   */
  protected windowResizeSubscription: Subscription;

  /**
   * Window resize event subscription
   */
  protected attachmentSubscription: Subscription;

  public legacyPaywallEnabled: boolean = false;

  /**
   * Constructor
   * @param service
   * @param popup
   * @param cd
   * @param platformId
   */
  constructor(
    protected service: ComposerService,
    protected popup: PopupService,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Handles Init event
   * @internal
   */
  ngOnInit(): void {
    this.windowResizeSubscription = this.windowResize$
      .pipe(debounceTime(250))
      .subscribe(() => this.calcNarrow());

    this.attachmentSubscription = this.attachment$.subscribe(attachment => {
      if (!attachment && this.fileUploadComponent) {
        this.fileUploadComponent.reset();
      }
    });

    /**
     * Don't show the monetize button if a post has a
     * legacy paywall because of potential
     * multi-currency complications.
     */
    if (this.service.monetization$.getValue()) {
      const paywall = this.service.monetization$.getValue();

      if (paywall && !paywall.hasOwnProperty('support_tier')) {
        this.legacyPaywallEnabled = true;
      }
    }
  }

  /**
   * Handles View Init event
   * @internal
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.calcNarrow(), 250);
    }
  }

  /**
   * Handles window resize event
   * @internal
   */
  @HostListener('window:resize') onWindowResize() {
    this.windowResize$.next();
  }

  /**
   * Triggers when change detection runs
   * @internal
   */
  ngOnChanges() {
    this.windowResize$.next();
  }

  /**
   * Handles Destroy event
   * @internal
   */
  ngOnDestroy(): void {
    this.windowResizeSubscription.unsubscribe();
    this.attachmentSubscription.unsubscribe();
  }

  /**
   * Calculates if the toolbar should be "narrow" (no labels)
   */
  calcNarrow() {
    if (
      this.toolbarWrapper.nativeElement &&
      this.toolbarWrapper.nativeElement.clientWidth
    ) {
      const narrow = this.toolbarWrapper.nativeElement.clientWidth <= 550;

      if (narrow !== this.narrow) {
        this.narrow = narrow;
        this.detectChanges(); // Be VERY CAREFUL as this runs on ngOnChanges, as well
      }
    }
  }

  /**
   * NSFW subject from service
   */
  get nsfw$(): BehaviorSubject<NsfwSubjectValue> {
    return this.service.nsfw$;
  }

  /**
   * Monetization subject from service
   */
  get monetization$(): BehaviorSubject<MonetizationSubjectValue> {
    return this.service.monetization$;
  }

  /**
   * Tags subject from service
   */
  get tags$(): BehaviorSubject<TagsSubjectValue> {
    return this.service.tags$;
  }

  /**
   * Can edit metadata? (attachment/rich embed/remind)
   */
  get canEditMetadata(): boolean {
    return this.service.canEditMetadata();
  }

  /**
   * Attachment subject from service
   */
  get attachment$(): BehaviorSubject<AttachmentSubjectValue> {
    return this.service.attachment$;
  }

  /**
   * inProgress subject from service
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Is posting flag from the service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * canPost subject from service
   */
  get canPost$() {
    return this.service.canPost$;
  }

  /**
   * Is this an edit?
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  get showShimmer() {
    return this.isModal && !this.service.monetization$.getValue();
  }

  /**
   * Emits the new attachment
   * @param $event
   */
  onAttachmentSelect($event: FileUploadSelectEvent): void {
    if (!($event instanceof File)) {
      // Unsupported attachment type
      console.warn('Composer/Toolbar: Unsupported attachment type', $event);
      return;
    } else if (!$event) {
      // Most likely pressed Esc on dialog
      return;
    }

    this.service.attachment$.next($event);
  }

  /**
   * Shows NSFW popup
   * @param $event
   */
  async onNsfwClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(NsfwComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows monetization popup
   * @param $event
   */
  async onMonetizeClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(MonetizeComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows tags popup
   * @param $event
   */
  async onTagsClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(TagsComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows scheduler popup
   * @param $event
   */
  async onSchedulerClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(ScheduleComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Emits post event
   * @param buttonComponentAction
   */
  onPost(buttonComponentAction: ButtonComponentAction): void {
    this.onPostEmitter.emit(buttonComponentAction);
  }

  /**
   * Triggers change detection
   */
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
