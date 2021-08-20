import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HaroldComponent } from './components/harold/harold.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MessageComponent } from './components/message/message.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { FeedComponent } from './components/feed/feed.component';
import { FriendsComponent } from './components/friends/friends.component';

const routes: Route[] = [
  {
    path: '',
    // redirectTo: 'feed',
    component: FeedComponent,
  },
  {
    path: 'feed',
    component: FeedComponent,
  },
  {
    path: 'user/:id',
    component: UserDataComponent,
  },
  {
    path: 'account/login',
    component: LoginComponent,
  },
  {
    path: 'account/registration',
    component: RegistrationComponent,
  },
  {
    path: 'messages/:id',
    component: MessageComponent,
  },
  {
    path: 'friends',
    component: FriendsComponent,
  },
  {
    path: 'dialogs',
    component: DialogComponent,
  },
  {
    path: 'harold',
    component: HaroldComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
