import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  GlobalScrollService,
  ScrollSubscription,
} from '../../../services/ux/global-scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'infinite-scroll',
  template: `
    <m-loadingSpinner [inProgress]="inProgress"></m-loadingSpinner>
    <div
      class="m-infinite-scroll-manual"
      [class.m-infinite-scroll-manual__loadMore]="!iconOnly"
      [class.mdl-color--blue-grey-200]="!iconOnly"
      [class.mdl-color-text--blue-grey-500]="!iconOnly"
      [hidden]="inProgress || !moreData"
      (click)="manualLoad()"
      *ngIf="!hideManual"
    >
      <ng-container
        i18n="@@COMMON__INFINITE_SCROLL__LOAD_MORE"
        *ngIf="!iconOnly"
        >Click to load more</ng-container
      >

      <i class="material-icons" *ngIf="iconOnly">keyboard_arrow_down</i>
    </div>
    <div
      class="m-infinite-scroll-manual"
      [class.m-infinite-scroll-manual__noMore]="!iconOnly"
      [class.mdl-color--blue-grey-200]="!iconOnly"
      [class.mdl-color-text--blue-grey-500]="!iconOnly"
      [hidden]="moreData"
      *ngIf="!hideManual"
    >
      <ng-container i18n="@@COMMON__INFINITE_SCROLL__NOTHING_MORE"
        >Nothing more to load</ng-container
      >
    </div>
  `,
})
export class InfiniteScroll {
  @Input() on: any;
  @Input() scrollSource: any; // if not provided, it defaults to window
  @Input() iconOnly: boolean = false;

  @Output('load') loadHandler: EventEmitter<any> = new EventEmitter(true);
  @Input() distance: any;
  @Input() inProgress: boolean = false;
  @Input() moreData: boolean = true;
  @Input() hideManual: boolean = false;

  element: any;

  _content: any;
  subscription: [ScrollSubscription, Subscription];

  constructor(_element: ElementRef, private scroll: GlobalScrollService) {
    this.element = _element.nativeElement;
  }

  ngOnInit() {
    this.init();
  }

  init() {
    if (!this.scrollSource) {
      this.scrollSource = document;
    }
    this.subscription = this.scroll.listen(
      this.scrollSource,
      ((subscription, e) => {
        if (this.moreData) {
          let clientHeight, scrollTop;
          if (this.scrollSource === document) {
            clientHeight = document.body.clientHeight;
            scrollTop = document.body.scrollTop;
          } else {
            clientHeight = subscription.element.clientHeight;
            scrollTop = subscription.element.scrollTop;
          }

          if (
            this.element.offsetTop - this.element.clientHeight - clientHeight <=
            scrollTop
          ) {
            this.loadHandler.next(true);
          }
        }
      }).bind(this),
      100
    );
  }

  manualLoad() {
    this.loadHandler.next(true);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.scroll.unListen(this.subscription[0], this.subscription[1]);
  }
}
