import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainModule } from '../blockchain.module';
import { BlockchainMarketingTokenComponent } from './token.component';
import { BlockchainMarketingRewardsComponent } from './rewards.component';
import { MarketingModule } from '../../marketing/marketing.module';

const routes: Routes = [
  {
    path: 'tokens',
    redirectTo: 'token',
  },
  {
    path: 'token',
    component: BlockchainMarketingTokenComponent,
    data: {
      title:
        'Buy, Support, & Expand Your Audience with Social Media Cryptocurrency',
      description:
        'Buy Minds tokens to expand your reach, support your favorite channels, and unlock premium features on Minds.',
      ogImage: '/assets/product-pages/token/token-1.jpg',
      canonicalUrl: '/token',
    },
  },
  {
    path: 'reward',
    redirectTo: 'rewards',
  },
  {
    path: 'rewards',
    component: BlockchainMarketingRewardsComponent,
    data: {
      title: 'Rewards',
      description: 'Earn tokens for your contributions to the network',
      ogImage: '/assets/product-pages/rewards/rewards-1.jpg',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlockchainModule,
    MarketingModule,
  ],
  declarations: [
    BlockchainMarketingTokenComponent,
    BlockchainMarketingRewardsComponent,
  ],
})
export class BlockchainMarketingModule {}
