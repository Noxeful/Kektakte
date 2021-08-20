import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { WallComment } from '../../entities/wallComment';
import { WallPost } from '../../entities/wallPost';
import { ActivatedRoute } from '@angular/router';
import { WallService } from '../../services/wall.service';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent implements OnInit {
  public postComments: WallComment[] = [(new WallComment(1, 1, 'avtor1', 'ava', new Date(3), 1, 'text', 'picture', 3, 2)), (new WallComment(2, 1,  'avtor2', 'ava', new Date(3), 1, 'text', 'picture', 2, 2)), (new WallComment(3, 1,  'avtor3', 'ava', new Date(3), 1, 'text', 'picture', 1, 3))];

  public posts: WallPost[] = [(new WallPost(1, 1, 'Kekushok', 'ava', new Date(3), 'text', 'kartinka', 5, 3, this.postComments)), (new WallPost(1, 1, 'Kekushok', 'ava', new Date(3), 'text', 'kartinka', 5, 3, this.postComments))];

  public myUserId: number = +localStorage.getItem('userId');
  public isDataReady: boolean = false;
  public friendsIdList: number[] = [];
  public tempArr: number[] = [4, 2, 7, 1, 3, 6, 5];

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone,
              private activatedRoute: ActivatedRoute,  private wallService: WallService, private eventsService: EventsService, private userService: UserService) { }

  ngOnInit(): void {
      this.eventsService.reloadDataEvent.subscribe((data) => {
          if (data) {
              this.loadPosts(this.myUserId);
          }
          console.log('event kek srabotal from FEED');
          this.cdRef.markForCheck();
      });

      this.loadPosts(this.myUserId);
  }

    public loadPosts(pageId: number): void {
        this.posts = [];
        this.userService.getFriendsId(pageId)
            .subscribe((friendsData) => {
                    this.friendsIdList = friendsData;
                    const tempFriendsIdList: number[] = friendsData;
                    this.wallService.getAllWallPostsForFeed(tempFriendsIdList)
                        .subscribe((postsData) => {
                                postsData.sort((a, b) => +new Date(b.created) - +new Date(a.created));
                                this.posts = postsData;
                                this.cdRef.markForCheck();
                            },
                            error => console.log(error));
                    this.isDataReady = true;
                    this.cdRef.markForCheck();
                },
                error => console.log(error)
            );

    }

}
