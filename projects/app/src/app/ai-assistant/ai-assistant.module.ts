import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PoModule } from '../../../../ui/src/public-api';

import { SetupComponent } from './setup/setup.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'setup', component: SetupComponent },
  { path: 'chat', component: ChatComponent },
  { path: '', redirectTo: 'setup', pathMatch: 'full' }
];

@NgModule({
  declarations: [SetupComponent, ChatComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), PoModule]
})
export class AiAssistantModule {}
