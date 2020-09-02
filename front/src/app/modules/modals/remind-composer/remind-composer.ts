import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { ActivityPreview } from '../../legacy/components/cards/activity/preview';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';

// had forwardRef(() => ActivityPreview)
@Component({
  selector: 'm-modal-remind-composer',
  inputs: ['_default: default', 'open', '_object: object'],
  outputs: ['closed', 'post'],
  template: `
    <m-modal
      [open]="open"
      (closed)="close($event)"
      class="mdl-color-text--blue-grey-700"
    >
      <div class="m-modal-remind-composer">
        <h3
          class="m-modal-remind-title"
          i18n="@@MODALS__REMIND_COMPOSER__REMIND_TITLE"
        >
          Remind
        </h3>

        <ng-template
          #itemTemplate
          let-choice="choice"
          let-selectChoice="selectChoice"
        >
          <m-post-autocomplete-item-renderer
            [choice]="choice"
            [selectChoice]="selectChoice"
          ></m-post-autocomplete-item-renderer>
        </ng-template>

        <m-text-input--autocomplete-container>
          <textarea
            name="message"
            [(ngModel)]="message"
            placeholder="Enter your remind status here (optional)"
            i18n-placeholder="@@MODALS__REMIND_COMPOSER__PLACEHOLDER"
            [autoGrow]
            mTextInputAutocomplete
            [findChoices]="suggestions.findSuggestions"
            [getChoiceLabel]="suggestions.getChoiceLabel"
            [itemTemplate]="itemTemplate"
            [triggerCharacters]="['#', '@']"
          ></textarea>
        </m-text-input--autocomplete-container>

        <div class="m-modal-remind-composer-buttons">
          <a class="m-modal-remind-composer-send" (click)="send()">
            <i class="material-icons">send</i>
          </a>
        </div>
      </div>

      <ng-template dynamic-host></ng-template>
    </m-modal>
  `,
})
export class RemindComposerModal {
  open: boolean = false;
  closed: EventEmitter<any> = new EventEmitter();
  post: EventEmitter<any> = new EventEmitter();
  object: any = {};

  message: string = '';

  @ViewChild(DynamicHostDirective, { static: true })
  cardHost: DynamicHostDirective;

  constructor(
    public suggestions: AutocompleteSuggestionsService,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  set _object(object: any) {
    this.object = object;
  }

  set _default(message: string) {
    this.message = message;
  }

  ngAfterViewInit() {
    this.loadPreview();
  }

  close(e?) {
    this.open = false;
    this.closed.next(true);
  }

  send() {
    this.post.next({
      message: this.message,
    });

    this.close();
  }

  loadPreview() {
    const previewFactory = this._componentFactoryResolver.resolveComponentFactory(
        ActivityPreview
      ),
      viewContainerRef = this.cardHost.viewContainerRef;

    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(previewFactory);

    if (this.object && !this.object.remind_object) {
      (<ActivityPreview>componentRef.instance).object = this.object;
    } else if (this.object && this.object.remind_object) {
      (<ActivityPreview>(
        componentRef.instance
      )).object = this.object.remind_object;
    }

    componentRef.changeDetectorRef.detectChanges();
  }
}
