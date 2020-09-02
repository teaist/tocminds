import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { ModalsModule } from '../modals/modals.module';

import { PayWall } from './paywall/paywall.component';
import { PaywallCancelButton } from './paywall/paywall-cancel.component';
import { PaymentsNewCard } from './new-card/new-card.component';
import { PaymentsSelectCard } from './select-card/select-card.component';
import { BTCService } from './btc/btc.service';
import { BTCComponent } from './btc/btc.component';
import { BTCSettingsComponent } from './btc/settings.component';
import { NewCardModalComponent } from './new-card-modal/new-card-modal.component';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    ModalsModule,
  ],
  declarations: [
    PayWall,
    PaywallCancelButton,
    PaymentsNewCard,
    PaymentsSelectCard,
    BTCComponent,
    BTCSettingsComponent,
    NewCardModalComponent,
  ],
  exports: [
    PayWall,
    PaywallCancelButton,
    PaymentsNewCard,
    PaymentsSelectCard,
    NewCardModalComponent,
  ],
  providers: [BTCService],
})
export class PaymentsModule {}
