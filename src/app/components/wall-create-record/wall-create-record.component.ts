import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { PictureService } from '../../services/picture.service';
import { ActivatedRoute } from '@angular/router';
import { WallService } from '../../services/wall.service';
import { WallPostCreateDTO } from '../../entities/wallPostCreateDTO';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-wall-create-record',
  templateUrl: './wall-create-record.component.html',
  styleUrls: ['./wall-create-record.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallCreateRecordComponent implements OnInit {

  @Input() public myUserId: number ;
  @Input() public userIdFromParams: number;

  public myAvatarBase64: string;
  public inputPlaceholderString: string;


  public addRecordForm: FormGroup;
  public textControl: FormControl;
  public text: string;
  public pictureBase64: string;

  constructor(private cdRef: ChangeDetectorRef, private pictureService: PictureService, private activatedRoute: ActivatedRoute, private wallService: WallService, private eventsService: EventsService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
        .subscribe( params => {
          const data = +params.get('id').replace(':', '');
          this.getAvatarAsBase64(this.myUserId);
          this.getInputPlaceholderString(data);
          this.buildForm();
          this.cdRef.markForCheck();
        });


  }

  private buildForm(): void {
    this.textControl = new FormControl('', [Validators.required]);
    this.addRecordForm = new FormGroup({
      text: this.textControl
    });
    this.addRecordForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
          this.text = data.text;
          this.cdRef.markForCheck();
        });
  }

  public addRecord(): void {
      this.wallService.createPost(new WallPostCreateDTO(this.myUserId, this.userIdFromParams, this.text, this.pictureBase64))
          .subscribe((data) => {
              if (data.state) {
                  console.log(data.message, ' createPostResponse: ');
                  this.eventsService.reloadDataEvent.emit(true);
                  this.addRecordForm.controls.text.setValue('');
                  this.cdRef.markForCheck();
              }
          }, error => console.log(error));
  }

  public getBase64FromImage(): void {
    const picInput: any = document.getElementById('image-input');
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
      this.inputPlaceholderString = 'Напишите что-нибудь..';
    } else if (this.myUserId === data) {
      this.inputPlaceholderString = 'Что у вас нового?';
    }
    this.cdRef.markForCheck();
  }

}
