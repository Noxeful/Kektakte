import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WallPost } from '../../entities/wallPost';
import { WallService } from '../../services/wall.service';
import { EventsService } from '../../services/events.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { WallPostUpdateDTO } from '../../entities/wallPostUpdateDTO';
import { WallPostRatingDTO } from '../../entities/wallPostRatingDTO';
import { data } from 'browserslist';

@Component({
  selector: 'app-wall-post',
  templateUrl: './wall-post.component.html',
  styleUrls: ['./wall-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallPostComponent implements OnInit {

  @Input() public wallPost: WallPost;
  @Input() public userIdFromParams: number;
  @Input() public isItFeed: boolean = false;

  public isCommentsOpen: boolean = false;
  public myUserId: number = +localStorage.getItem('userId');
  public tempText: string;
  public tempPicture: string;


  public editRecordForm: FormGroup;
  public textControl: FormControl;
  public isEditingOn: boolean = false;

  constructor(private wallService: WallService, private eventsService: EventsService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.eventsService.deleteCommentEvent
        .subscribe((data) => {
          const comment = this.wallPost.comments.find((item) => item.commentId === data);
          const commentIndex = this.wallPost.comments.indexOf(comment);
          this.wallPost.comments.splice(commentIndex, 1);
          this.cdRef.markForCheck();
        });
    this.eventsService.updateCommentEvent
        .subscribe((data) => {
          const comment = this.wallPost.comments.find((item) => item.commentId === data.commentId);
          const commentIndex = this.wallPost.comments.indexOf(comment);
          this.wallPost.comments.splice(commentIndex, 1, data);
          this.cdRef.markForCheck();
        });
    this.eventsService.createCommentEvent
        .subscribe((data) => {
          this.wallPost.comments.push(data);
          this.cdRef.markForCheck();
        });
  }

  public commentsToggle(): void {
    this.isCommentsOpen = !this.isCommentsOpen;
  }

  public deletePost(postId: number): void {
    this.wallService.deletePost(postId)
        .subscribe((data) => {
            if (data.state) {
              console.log(data.message, ' deletePostResponse: ');
              this.eventsService.reloadDataEvent.emit(true);
              this.cdRef.markForCheck();
            }
        }, error => console.log(error));
  }

  private builEditdForm(): void {
    this.tempPicture = this.wallPost.picture;
    this.tempText = this.wallPost.text;
    this.textControl = new FormControl('', [Validators.required]);
    this.editRecordForm = new FormGroup({
      text: this.textControl
    });
    this.editRecordForm.controls.text.setValue(this.wallPost.text);
    this.editRecordForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
          this.wallPost.text = data.text;
          this.cdRef.markForCheck();
        });
    this.cdRef.markForCheck();
  }

  public getBase64FromImage(): void {
    const picInput: any = document.getElementById('wall-post-image-edit-input');
    const reader = new FileReader();
    reader.onload = ((e) => {
      const result = btoa(e.target.result.toString());
      this.wallPost.picture = result;
      this.cdRef.markForCheck();
    });
    reader.readAsBinaryString(picInput.files.item(0));
  }

  public editPost(): void {
    if (this.myUserId !== this.userIdFromParams) {
      return;
    }
    this.isEditingOn = !this.isEditingOn;
    this.builEditdForm();
    this.cdRef.markForCheck();
  }

  public cancelEditing(): void {
    this.isEditingOn = !this.isEditingOn;
    this.wallPost.picture = this.tempPicture;
    this.wallPost.text = this.tempText;
    this.cdRef.markForCheck();
  }

  public saveEditedPost(): void {
    console.log(this.wallPost);
    if (!this.wallPost.postId && !this.wallPost.text && !this.wallPost.picture) {
      return;
    }
    this.wallService.updatePost(new WallPostUpdateDTO(this.wallPost.postId, this.wallPost.text, this.wallPost.picture))
        .subscribe((data) => {
          if (data.state) {
            console.log(data.message);
            this.isEditingOn = !this.isEditingOn;
            this.eventsService.reloadDataEvent.emit(true);
            this.cdRef.markForCheck();

          }
        }, error => console.log(error));
  }

  public setWallPostRating(postId: number, rating: boolean): void {
    this.wallService.setWallPostRating(new WallPostRatingDTO(postId, rating))
        .subscribe((data) => {
          if (data.state) {
            console.log(data.message);
            this.wallPost = data.post;
            this.cdRef.markForCheck();
          }
        }, error => console.log(error));
  }

}
