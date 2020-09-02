import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Output,
  ViewChild,
  Input,
} from '@angular/core';
import { UniqueId } from '../../../../helpers/unique-id.helper';
import { ButtonComponentAction } from '../../../../common/components/button-v2/button.component';
import { ComposerService } from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { PopupComponent } from '../popup/popup.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { Router } from '@angular/router';
import { InMemoryStorageService } from '../../../../services/in-memory-storage.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Base component for composer. It contains all the parts.
 */
@Component({
  selector: 'm-composer__base',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'base.component.html',
  providers: [PopupService],
})
export class BaseComponent implements AfterViewInit {
  /**
   * Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Is the composer in a modal?
   */
  @Input() isModal: boolean = false;

  /**
   * Popup component ref
   */
  @ViewChild('popupComponent', { static: true }) popupComponent: PopupComponent;

  /**
   * Text area component ref
   */
  @ViewChild('textAreaComponent', { static: true })
  textAreaComponent: TextAreaComponent;

  /**
   * Unique ID for textarea
   */
  textareaId: string = UniqueId.generate('m-composer__textarea');

  /**
   * Last error
   */
  error: string;

  /**
   * The urn of the Minds+ support tier
   */
  private readonly plusTierUrn: string;

  /**
   * Constructor
   * @param service
   * @param popup
   * @param router
   * @param inMemoryStorage
   * @param cd
   * @param injector
   */
  constructor(
    protected service: ComposerService,
    protected popup: PopupService,
    protected router: Router,
    protected inMemoryStorage: InMemoryStorageService,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected toasterService: FormToastService,
    configs: ConfigsService
  ) {
    this.plusTierUrn = configs.get('plus').support_tier_urn;
  }

  /**
   * Initializes after all components were injected
   */
  ngAfterViewInit(): void {
    this.popup.setUp(this.popupComponent, this.injector);
  }

  /**
   * Attachment preview subject in service
   */
  get attachmentPreview$() {
    return this.service.attachmentPreview$;
  }

  /**
   * Rich embed preview subject in service
   */
  get richEmbedPreview$() {
    return this.service.richEmbedPreview$;
  }

  /**
   * In progress boolean subject in service
   */
  get inProgress$() {
    return this.service.inProgress$;
  }

  /**
   * Progress percentage subject in service
   */
  get progress$() {
    return this.service.progress$;
  }

  /**
   * Attachment error subject in service
   */
  get attachmentError$() {
    if (this.service.attachmentError$.value) {
      this.toasterService.error(this.service.attachmentError$.value);
    }
    return this.service.attachmentError$;
  }

  /**
   * Focuses the main text area
   */
  focus() {
    this.textAreaComponent.focus();
  }

  /**
   * Creates a blog using the current message
   */
  createBlog() {
    const message = this.service.message$.getValue();

    this.service.isMovingContent$.next(true);
    this.inMemoryStorage.set('newBlogContent', message);

    if (this.popupComponent) {
      this.popup.close();
    }

    this.router.navigate(['/blog/edit/new']);
  }

  /**
   * Updates the attachment. Called when pasting an image or video.
   * @param file
   */
  onAttachmentPaste(file) {
    this.service.attachment$.next(file);
  }

  /**
   * Ensure Minds+ posts follow the rules
   */
  meetsPlusPostRequirements(): boolean {
    const mon = this.service.monetization$.getValue();
    const isPlusPost =
      mon && mon.support_tier && mon.support_tier.urn === this.plusTierUrn;

    if (!isPlusPost) {
      return true;
    }

    // Cannot be an external link
    const richEmbed = this.service.richEmbed$.getValue();
    if (richEmbed && !this.richEmbedPreview$.getValue().entityGuid) {
      this.toasterService.error('Minds+ posts cannot be external links');
      return false;
    }

    // Must have 1+ hashtags
    if (this.service.tagCount$.getValue() < 1) {
      this.toasterService.error('Minds+ posts must have at least one hashtag');
      return false;
    }
    return true;
  }

  /**
   * Post intent
   * @param event
   */
  async onPost(event: ButtonComponentAction) {
    if (!this.meetsPlusPostRequirements()) {
      return;
    }

    try {
      this.error = '';
      this.detectChanges();

      const activity = await this.service.post();
      this.onPostEmitter.next(activity);
    } catch (e) {
      this.error = (e && e.message) || 'Internal error';

      if (e.error && e.error.message) {
        this.error = e.error.message;
      }

      this.toasterService.error(this.error);
    }

    this.detectChanges();
  }

  /**
   * Displays a dialog if there are any unsaved change
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (
      this.service.message$.getValue() ||
      this.service.attachment$.getValue()
    ) {
      const confirmation = confirm(
        this.service.isMovingContent$.getValue()
          ? `Discard changes? Text will be moved into blog editor.`
          : `Discard changes?`
      );

      this.service.isMovingContent$.next(false);

      return confirmation;
    }

    return true;
  }

  /**
   * Detect async changes
   */
  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
