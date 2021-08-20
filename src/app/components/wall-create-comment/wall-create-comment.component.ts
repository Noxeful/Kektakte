import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { PictureService } from '../../services/picture.service';
import { ActivatedRoute } from '@angular/router';
import { WallService } from '../../services/wall.service';
import { WallPostCreateDTO } from '../../entities/wallPostCreateDTO';
import { EventsService } from '../../services/events.service';
import { WallComment } from '../../entities/wallComment';
import { WallCommentCreateDTO } from '../../entities/wallCommentCreateDTO';

@Component({
  selector: 'app-wall-create-comment',
  templateUrl: './wall-create-comment.component.html',
  styleUrls: ['./wall-create-comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallCreateCommentComponent implements OnInit {

  @Input() public myUserId: number ;
  @Input() public userIdFromParams: number;
  @Input() public wallPostId: number;
  @Input() public isItFeed: boolean = false;

  public myAvatarBase64: string;
  public inputPlaceholderString: string;


  public addCommentForm: FormGroup;
  public textControl: FormControl;
  public text: string;
  public pictureBase64: string;

  constructor(private cdRef: ChangeDetectorRef, private pictureService: PictureService, private activatedRoute: ActivatedRoute, private wallService: WallService, private eventsService: EventsService) { }

  ngOnInit(): void {
      if(!this.isItFeed) {
          this.activatedRoute.paramMap
              .subscribe( params => {
                  const data = +params.get('id').replace(':', '');
                  this.getAvatarAsBase64(this.myUserId);
                  this.getInputPlaceholderString(data);
                  this.buildForm();
                  this.cdRef.markForCheck();
              });
      } else {
          this.getAvatarAsBase64(this.myUserId);
          this.getInputPlaceholderString(this.myUserId);
          this.buildForm();
          this.cdRef.markForCheck();
      }
  }

  private buildForm(): void {
    this.textControl = new FormControl('', [Validators.required]);
    this.addCommentForm = new FormGroup({
      text: this.textControl
    });
    this.addCommentForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
          this.text = data.text;
          this.cdRef.markForCheck();
        });
  }

  public addComment(): void {
    this.wallService.createComment(new WallCommentCreateDTO(this.myUserId, this.wallPostId, this.text, this.pictureBase64))
        .subscribe((data) => {
            console.log(data.message, ' createPostResponse: ');
            if (data.state) {
                this.eventsService.createCommentEvent.emit(data.comment);
                this.addCommentForm.controls.text.setValue('');
                this.cdRef.markForCheck();
          }
        }, error => console.log(error));
  }

  public getBase64FromImage(): void {
    const picInput: any = document.getElementById('create-comment-image-input');
    const reader = new FileReader();
    reader.onload = ((e) => {
      const result = btoa(e.target.result.toString());
      this.pictureBase64 = result;
      this.cdRef.markForCheck();
    });
    reader.readAsBinaryString(picInput.files.item(0));
  }

  public getAvatarAsBase64(id: number): void {
    this.pictureService.getAvatar(id)
        .pipe(
            take(1)
        )
        .subscribe((data) => {
              this.myAvatarBase64 = data;
              this.cdRef.markForCheck();
            },
            error => console.log(error)
        );
  }

  public getInputPlaceholderString(data): void {
    if (this.myUserId !== data) {
      this.inputPlaceholderString = 'Оставьте комментарий';
    } else if (this.myUserId === data) {
      this.inputPlaceholderString = 'Оставьте комментарий';
    }
    this.cdRef.markForCheck();
  }

}

