import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { PictureService } from '../../services/picture.service';
import { take } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-friends-mini-list',
  templateUrl: './friends-mini-list.component.html',
  styleUrls: ['./friends-mini-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsMiniListComponent implements OnInit {

  public friendsIdList: number[] = [];
  public pageIdFromParams: number;
  public mapAvaAndName: Map<string, string> = new Map();
  public myId: number = +localStorage.getItem('userId');
  public addDeleteButtonToggle: boolean = false;
  public isDataReady: boolean = false;


  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone, private userService: UserService,
              private activatedRoute: ActivatedRoute, private eventsService: EventsService, private pictureService: PictureService,
              private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap
          .subscribe( params => {
              const data = +params.get('id').replace(':', '');
              this.pageIdFromParams = data;
              this.getFriendsIdList(data);
          });
  }

    public isItMyPage(): boolean {
        return this.myId === this.pageIdFromParams;
    }

  public getFriendsIdList(pageId: number): void {
      this.friendsIdList = [];
      this.userService.getFriendsId(pageId)
              .subscribe((data) => {
                  this.friendsIdList = data;
                  this.getFriendsData(data);
                  this.chooseAddOrDeleteButton(this.myId, data);
                  this.cdRef.markForCheck();
              },
                  error => console.log(error)
              );
  }

  public chooseAddOrDeleteButton(id: number, friendsList: number[]): void {
      this.addDeleteButtonToggle = false;
      friendsList.forEach((item) => {
          if (item === id){
              this.addDeleteButtonToggle = true;
              this.cdRef.markForCheck();
          }
      });
  }

  public getFriendsData(idArray: number[]): void {
      this.mapAvaAndName.clear();
      this.isDataReady = false;
      this.pictureService.getAvatarCollection(idArray)
          .subscribe((data) => {
              const avatarCollection = data;
              this.userService.getAllUserDataById(idArray)
                  .subscribe((data1) => {
                      const userDataCollection = data1;
                      for (let key in avatarCollection) {
                          userDataCollection.forEach((userDataItem) => {
                              if (Number(key) === userDataItem.id) {
                                  this.mapAvaAndName.set(userDataItem.name, avatarCollection[key]);
                              }
                          });
                      }
                      this.isDataReady = !this.isDataReady;
                      this.cdRef.markForCheck();
                  }
                  , error => console.log('GetAllUserDataById Error: ', error));
          }
          , error => console.log('GetAvatarCollection Error: ', error));
  }

    public createFR(targetId: number): void {
        this.userService.createFriendsRequest(targetId)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                this.cdRef.markForCheck();
            });
    }

  public deleteFriendById(friendId: number): void {
      this.userService.deleteFriendById(friendId)
          .subscribe((data) => {
              this.getFriendsIdList(this.pageIdFromParams);
              setTimeout(() => {
                  this.getFriendsData(this.friendsIdList);
                  this.cdRef.markForCheck();
              }, 100);
              this.addDeleteButtonToggle = !this.addDeleteButtonToggle;
              this.cdRef.markForCheck();
          }, error => console.log(error)
          );
  }

  public transitToUserByName(name: string): void {
      this.userService.getUserByName(name)
          .pipe(
              take(1)
          )
          .subscribe((data) => {
              const id: number = data.id;
              this.navigationService.goToUserPage(id);
              this.cdRef.markForCheck();
          });
  }
}
