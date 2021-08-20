import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { PictureService } from '../../services/picture.service';
import { UserService } from '../../services/user.service';
import { FriendsRequests } from '../../entities/friendsRequests';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-friends-requests',
  templateUrl: './friends-requests.component.html',
  styleUrls: ['./friends-requests.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsRequestsComponent implements OnInit {

  public friendsRequestsArray: FriendsRequests[] = [];
  public placeholderInt: number = 0;
  public mapAvaAndName: Map<string, string> = new Map();


  constructor(private cdRef: ChangeDetectorRef,
              private ngZone: NgZone, private router: Router, private navigationService: NavigationService,
              private pictureService: PictureService, private activatedRoute: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
      this.getAllFriendsRequests(this.placeholderInt);
      setTimeout(() => {
          this.getFriendsRequestData(this.friendsRequestsArray);
      }, 300);

  }

  public getAllFriendsRequests(userId: number): void {
    this.userService.getAllFriendsRequests(userId)
        .subscribe((data) => {
          this.friendsRequestsArray = data;
          this.cdRef.markForCheck();
        });
  }

  public getFriendsRequestData(requestsArray: FriendsRequests[]): void {
      this.mapAvaAndName.clear();
      requestsArray.forEach((item) => {
          this.pictureService.getAvatar(item.userId)
              .subscribe((data) => {
                  let ava = data;
                  this.userService.getUserData(item.userId)
                      .subscribe((data1) => {
                          let name = data1.name;
                          let lastName = data1.lastName;
                          this.mapAvaAndName.set(name + ' ' + lastName, ava);
                          this.cdRef.markForCheck();
                      });
                  this.cdRef.markForCheck();
              });
      });
  }

  public acceptFriendsRequest(friendReq: FriendsRequests): void {
      let newFR = new FriendsRequests(friendReq.userId, friendReq.requestedFriendId, true, true);
      this.userService.sendFriendsRequestToHandler(newFR)
          .pipe(
              take(1)
          )
          .subscribe((data) => {
                  this.getAllFriendsRequests(this.placeholderInt);
                  setTimeout(() => {
                      this.getFriendsRequestData(this.friendsRequestsArray);
                  }, 300);
              this.cdRef.markForCheck();
          }
          ,
              error => console.log(error)
          );
  }

    public declineFriendsRequest(friendReq: FriendsRequests): void {
        let newFR = new FriendsRequests(friendReq.userId, friendReq.requestedFriendId, false, true);
        this.userService.sendFriendsRequestToHandler(newFR)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                    this.getAllFriendsRequests(this.placeholderInt);
                    setTimeout(() => {
                        this.getFriendsRequestData(this.friendsRequestsArray);
                    }, 300);
                    this.cdRef.markForCheck();
                }
                ,
                error => console.log(error)
            );
    }

    public goToUser(id: number)  {
        this.router.navigate([`/user/:${id}/`]);
    }

}
