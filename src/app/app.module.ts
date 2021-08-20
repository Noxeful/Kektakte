import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HaroldComponent } from './components/harold/harold.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/authInterceptor';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './components/registration/registration.component';
import { MessageComponent } from './components/message/message.component';
import { DisplayLoginComponent } from './components/display-login/display-login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { FeedComponent } from './components/feed/feed.component';
import { FriendsMiniListComponent } from './components/friends-mini-list/friends-mini-list.component';
import { FriendsRequestsComponent } from './components/friends-requests/friends-requests.component';
import { FriendsComponent } from './components/friends/friends.component';
import { WallComponent } from './components/wall/wall.component';
import { WallCommentComponent } from './components/wall-comment/wall-comment.component';
import { WallPostComponent } from './components/wall-post/wall-post.component';
import { WallCreateRecordComponent } from './components/wall-create-record/wall-create-record.component';
import { WallCreateCommentComponent } from './components/wall-create-comment/wall-create-comment.component';


@NgModule({
  declarations: [
    AppComponent,
    HaroldComponent,
    LoginComponent,
    RegistrationComponent,
    MessageComponent,
    DisplayLoginComponent,
    LogoutComponent,
    DialogComponent,
    UserDataComponent,
    FeedComponent,
    FriendsMiniListComponent,
    FriendsRequestsComponent,
    FriendsComponent,
    WallComponent,
    WallCommentComponent,
    WallPostComponent,
    WallCreateRecordComponent,
    WallCreateCommentComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
  providers: [
      AuthInterceptor,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
      },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
