import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { WallPost } from '../../entities/wallPost';
import { WallComment } from '../../entities/wallComment';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { WallService } from '../../services/wall.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallComponent implements OnInit {

  public postComments: WallComment[] = [(new WallComment(1, 1, 'avtor1', 'ava', new Date(3), 1, 'text', 'picture', 3, 2)), (new WallComment(2, 1,  'avtor2', 'ava', new Date(3), 1, 'text', 'picture', 2, 2)), (new WallComment(3, 1,  'avtor3', 'ava', new Date(3), 1, 'text', 'picture', 1, 3))];

  public posts: WallPost[] = [(new WallPost(1, 1, 'Kekushok', 'ava', new Date(3), 'text', 'kartinka', 5, 3, this.postComments)), (new WallPost(1, 1, 'Kekushok', 'ava', new Date(3), 'text', 'kartinka', 5, 3, this.postComments))];

  public myUserId: number = +localStorage.getItem('userId');
  public userIdFromParams: number;

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone,
              private activatedRoute: ActivatedRoute,  private wallService: WallService, private eventsService: EventsService) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap
          .subscribe( params => {
              const data = +params.get('id').replace(':', '');
              this.userIdFromParams = data;
              this.getAllWallPostsById(data);
              this.cdRef.markForCheck();
          });

      this.eventsService.reloadDataEvent.subscribe((data) => {
          if (data) {
              this.getAllWallPostsById(this.userIdFromParams);
          }
          console.log('event kek srabotal');
          this.cdRef.markForCheck();
      });
  }

  public getAllWallPostsById(postId: number): void {
    this.wallService.getAllWallPostsById(postId).subscribe((data) => {
          this.posts = data;
          console.log(data);
          this.cdRef.markForCheck();
        }, error => console.log(error)
    );
  }

}
