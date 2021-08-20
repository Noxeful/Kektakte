import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WallComment } from '../../entities/wallComment';
import { WallService } from '../../services/wall.service';
import { EventsService } from '../../services/events.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { WallPostUpdateDTO } from '../../entities/wallPostUpdateDTO';
import { WallCommentUpdateDTO } from '../../entities/wallCommentUpdateDTO';
import { WallPostRatingDTO } from '../../entities/wallPostRatingDTO';
import { WallCommentRatingDTO } from '../../entities/WallCommentRatingDTO';

@Component({
  selector: 'app-wall-comment',
  templateUrl: './wall-comment.component.html',
  styleUrls: ['./wall-comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallCommentComponent implements OnInit {

  @Input() public wallComment: WallComment;
  @Input() public myUserId: number;
  @Input() public userIdFromParams: number;
  @Input() public isItFeed: boolean = false;


  public isEditingOn: boolean = false;

  public tempText: string;
  public tempPicture: string;

  public editCommentForm: FormGroup;
  public textControl: FormControl;


  constructor(private wallService: WallService, private eventsService: EventsService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  public deleteComment(commentId: number): void {
    this.wallService.deleteComment(commentId)
        .subscribe((data) => {
          if (data.state) {
            console.log(data.message, ' deleteCommentResponse: ');
            // this.eventsService.reloadDataEvent.emit(true);
            this.eventsService.deleteCommentEvent.emit(this.wallComment.commentId);
            this.cdRef.markForCheck();
          }
        }, error => console.log(error));
  }

  private builEditdForm(): void {
    this.tempPicture = this.wallComment.picture;
    this.tempText = this.wallComment.text;
    this.textControl = new FormControl('', [Validators.required]);
    this.editCommentForm = new FormGroup({
      text: this.textControl
    });
    this.editCommentForm.controls.text.setValue(this.wallComment.text);
    this.editCommentForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
          this.wallComment.text = data.text;
          this.cdRef.markForCheck();
        });
    this.cdRef.markForCheck();
  }

  public getBase64FromImage(): void {
    const picInput: any = document.getElementById('wall-comment-image-edit-input');
    const reader = new FileReader();
    reader.onload = ((e) => {
      const result = btoa(e.target.result.toString());
      this.wallComment.picture = result;
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
    this.wallComment.picture = this.tempPicture;
    this.wallComment.text = this.tempText;
    this.cdRef.markForCheck();
  }

  public saveEditedComment(): void {
    console.log(this.wallComment);
    // if (!this.wallComment.postId && !this.wallComment.text && !this.wallComment.picture) {
    //   return;
    // }
    this.wallService.updateComment(new WallCommentUpdateDTO(this.wallComment.commentId, this.wallComment.text, this.wallComment.picture))
        .subscribe((data) => {
          if (data.state) {
            console.log(data.message);
            this.isEditingOn = !this.isEditingOn;
            // this.eventsService.reloadDataEvent.emit(true);
            this.eventsService.updateCommentEvent.emit(this.wallComment);
            this.cdRef.markForCheck();

          }
        }, error => console.log(error));
  }

  public setWallCommentRating(commentId: number, rating: boolean): void {
    this.wallService.setWallCommentRating(new WallCommentRatingDTO(commentId, rating))
        .subscribe((data) => {
          if (data.state) {
            console.log(data.message);
            this.wallComment = data.comment;
            this.cdRef.markForCheck();
          }
        }, error => console.log(error));
  }

}
