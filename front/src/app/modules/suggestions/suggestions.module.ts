import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LegacyModule } from '../legacy/legacy.module';

import { CommonModule } from '../../common/common.module';
import { SuggestionsSidebar } from './channel/sidebar.component';
import { GroupSuggestionsSidebarComponent } from './groups/sidebar.component';
import { AutocompleteSuggestionsService } from './services/autocomplete-suggestions.service';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    LegacyModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [SuggestionsSidebar, GroupSuggestionsSidebarComponent],
  exports: [SuggestionsSidebar, GroupSuggestionsSidebarComponent],
  providers: [AutocompleteSuggestionsService],
})
export class SuggestionsModule {}
