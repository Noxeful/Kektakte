import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { UserData } from '../../entities/userData';
import { UserService } from '../../services/user.service';
import { debounceTime, take } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { EventsService } from '../../services/events.service';
import { PictureService } from '../../services/picture.service';
import { CreateMessageDto } from '../../entities/createMessageDto';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDataComponent implements OnInit {

  public myUser: UserData = new UserData(1, '', '', new Date(), '', '', '', '');

  public turnOnUserInfo: boolean = true;
  public turnOnEdit: boolean = false;
  public status: boolean = true;
  public responseState: boolean;
  public responseMessage: string;

  public editAva: boolean = false;
  public isIntrestsOpen: boolean = false;
  public interestFormToggle: boolean = false;

  public userEditForm: FormGroup;
  public nameControl: FormControl;
  public lastNameControl: FormControl;
  public birthDateControl: FormControl;
  public cityControl: FormControl;
  public languageControl: FormControl;
  public ideologyControl: FormControl;

  public statusForm: FormGroup;
  public statusControl: FormControl;

  public interestForm: FormGroup;
  public interestControl: FormControl;
  public interestStr: string;

  public quickMessageForm: FormGroup;
  public quickMessageControl: FormControl;
  public quickMessageStr: string;
  public quickMessageToggle: boolean = false;

  public userIdLs: number = +localStorage.getItem('userId');
  public userIdParams: number = 1;

  public tempBase64: string;
  public base64ForAvatar: string;

  public interests: string[] = [];

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone, private userService: UserService,
              private activatedRoute: ActivatedRoute, private navigationService: NavigationService,
              private eventsService: EventsService, private pictureService: PictureService, private messagesService: MessagesService) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
        .subscribe( params => {
          let data = +params.get('id').replace(':', '');
          this.userIdParams = data;
          this.getUserData(data);
          this.getAvatarAsBase64(data);
          this.getAllInterests(data);
          this.cdRef.markForCheck();
        });

    // this.getUserData(this.userIdParams);
    // this.getAvatarAsBase64(this.userIdParams);
    // this.getAllInterests(this.userIdParams);
    //
    // this.cdRef.markForCheck();
  }

  public isItMyPage(): boolean {
      return this.userIdLs === this.userIdParams;
  }

  public deleteInterest(interestStr: string): void {
      this.userService.deleteInterest(interestStr)
          .pipe(
              take(1)
          )
          .subscribe((data) => {
              this.getAllInterests(this.userIdParams);
              this.cdRef.markForCheck();
          },
              error => console.log(error)
          );
  }

  public createInterest(interestStr: string): void {
      this.userService.createInterest(interestStr)
          .pipe(
              take(1)
          )
          .subscribe((data) => {
              this.interestFormToggle = !this.interestFormToggle;
              this.getAllInterests(this.userIdParams);
              this.cdRef.markForCheck();
          },
              error => console.log(error)
          );
  }

  public getAllInterests(id: number): void {
      this.userService.getAllInterests(id)
          .subscribe((data) => {
             this.interests = data;
             this.cdRef.markForCheck();
          },
              error => console.log(error)
          );
  }

  public interestsBtnToggle(): void {
      this.isIntrestsOpen = !this.isIntrestsOpen;
  }

  public buildInterestForm(): void {
      this.interestControl = new FormControl();
      this.interestForm = new FormGroup({
          interest: this.interestControl,
      });
      this.interestForm.valueChanges
          .pipe(
              debounceTime(30)
          )
          .subscribe((data) => {
              this.interestStr = data.interest;
              this.cdRef.markForCheck();
          });
  }

  public createInterestToggle(): void {
      if (this.userIdParams !== this.userIdLs) {
          return;
      }
      this.interestFormToggle = !this.interestFormToggle;
      this.buildInterestForm();
  }

  public editAvaToggle(): void {
    if (this.userIdParams !== this.userIdLs) {
        return;
    }
    this.editAva = !this.editAva;
  }

  public getBase64FromImage(): void {
    const picInp: any = document.getElementById('image-input');
    const reader = new FileReader();
    reader.onload = ((e) => {
      const temptemp = btoa(e.target.result.toString());
      this.tempBase64 = temptemp;
      this.cdRef.markForCheck();
    });
    reader.readAsBinaryString(picInp.files.item(0));
  }

  public getAvatarAsBase64(id: number): void {
    this.pictureService.getAvatar(id)
        .pipe(
            take(1)
        )
        .subscribe((data) => {
              this.base64ForAvatar = data;
              this.cdRef.markForCheck();
            },
            error => console.log(error)
        );
  }

  public saveAvatar(base64str: string): void {
    this.pictureService.tryToCreateAvatar(base64str)
        .pipe(
            take(1)
        )
        .subscribe((data) => {
              setTimeout(() => {
                this.getAvatarAsBase64(this.userIdParams);
                this.editAvaToggle();
                this.cdRef.markForCheck();
              });
            },
            error => console.log(error)
        );
  }

  public getUserData(id: number): void {
    this.userService.getUserData(id)
        .pipe(
            take(1)
        )
        .subscribe((data) => {
          this.myUser = data;
          this.cdRef.markForCheck();
        },
            error => console.log(error)
        );
  }

  private buildUserEditForm(): void {
    this.nameControl = new FormControl(this.myUser.name, [Validators.required]);
    this.lastNameControl = new FormControl(this.myUser.lastName, [Validators.required]);
    this.birthDateControl = new FormControl(this.myUser.birthDate, [Validators.required]);
    this.cityControl = new FormControl(this.myUser.city, [Validators.required]);
    this.languageControl = new FormControl(this.myUser.language, [Validators.required]);
    this.ideologyControl = new FormControl(this.myUser.ideology, [Validators.required]);
    this.userEditForm = new FormGroup({
      name: this.nameControl,
      lastName: this.lastNameControl,
      birthDate: this.birthDateControl,
      city: this.cityControl,
      language: this.languageControl,
      ideology: this.ideologyControl,
    });
    this.userEditForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
          this.myUser.name = data.name;
          this.myUser.lastName = data.lastName;
          this.myUser.birthDate = data.birthDate;
          this.myUser.city = data.city;
          this.myUser.language = data.language;
          this.myUser.ideology = data.ideology;
          this.cdRef.markForCheck();
        });
  }

  public editUser(): void {
    if (this.userIdParams !== this.userIdLs) {
        return;
    }
    this.turnOnUserInfo = !this.turnOnUserInfo;
    this.turnOnEdit = !this.turnOnEdit;
    this.buildUserEditForm();
  }

  public sendQuickMessageToggle(): void {
      this.quickMessageToggle = !this.quickMessageToggle;
      this.buildQuickMessageForm();
  }

  public buildQuickMessageForm(): void {
      this.quickMessageControl = new FormControl('',[Validators.required]);
      this.quickMessageForm = new FormGroup({
          quickMessage: this.quickMessageControl,
      });
      this.quickMessageForm.valueChanges
          .pipe(
              debounceTime(30)
          )
          .subscribe((data) => {
              this.quickMessageStr = data.quickMessage;
              this.cdRef.markForCheck();
          });
  }

    public sendQuickMessage(): void {
      this.messagesService.CreateMessage(new CreateMessageDto(this.userIdParams, this.quickMessageStr))
          .subscribe((data) => {
              this.sendQuickMessageToggle();
              this.cdRef.markForCheck();
              },
              error => console.log(error, 'ошибочка')
          );
      setTimeout(() => {
          this.quickMessageControl.setValue('');
          }, 150);
    }

  public sendUserToEdit(myUser: UserData): void {
    this.userService.sendUserToEdit(myUser)
        .pipe(
            take(1)
        )
        .subscribe((data) => {
          this.responseState = data['state'];
          this.responseMessage = data['message'];
          this.turnOnUserInfo = !this.turnOnUserInfo;
          this.turnOnEdit = !this.turnOnEdit;
          this.getUserData(myUser.id);
          this.notification();
          this.cdRef.markForCheck();
        },
            error => console.log(error)
        );
  }

  public sendStatusToEdit(status: string): void {
    this.userService.updateStatus(status)
        .pipe(
            take(1)
        )
        .subscribe((data) => {
          this.responseState = data['state'];
          this.responseMessage = data['message'];
          this.status = !this.status;
          this.getUserData(this.myUser.id);
          this.notification();
          this.cdRef.markForCheck();
        },
            error => console.log(error)
        );
  }

  public editStatus(): void {
    if (this.userIdParams !== this.userIdLs) {
        return;
    }
    this.status = !this.status;
    this.buildStatusForm();
  }

  public notification(): void {
    this.responseState = true;
    setTimeout(() => {
      this.responseState = !this.responseState;
      this.cdRef.markForCheck();
    }, 3000);
  }

  public buildStatusForm(): void {
    this.statusControl = new FormControl(this.myUser.status);
    this.statusForm = new FormGroup({
      status: this.statusControl,
    });
    this.statusForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
          this.myUser.status = data.status;
          this.cdRef.markForCheck();
        });
  }
}
