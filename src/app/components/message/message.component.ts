import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, NgZone, Input } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { MessageDTO } from '../../entities/messageDTO';
import { Message } from '../../entities/message';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { EventsService } from '../../services/events.service';
import { CreateMessageDto } from '../../entities/createMessageDto';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { PictureService } from '../../services/picture.service';

@Component({
  selector: 'app-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MessageComponent implements OnInit {

  public destinationId: number;
  public textChat: string;
  public isDataReady: boolean = false;

  public messageArray: Message[];
  public userId: number = +localStorage.getItem('userId');
  public userAvatar: string = '';
  public destAvatar: string = '';

  public chatForm: FormGroup;
  public chatControl: FormControl;


  constructor(private messagesService: MessagesService, private cdRef: ChangeDetectorRef, private ngZone: NgZone,
              private eventsService: EventsService,
              private activatedRoute: ActivatedRoute,
              private navigationService: NavigationService,
              private pictureService: PictureService) {

  }

  public ngOnInit(): void {
    this.eventsService.changeMessId.subscribe((data) => {
        this.getMessages(new MessageDTO(1, data));
        this.destinationId = data;
        this.cdRef.markForCheck();
    });

    this.eventsService.messagesChanged.subscribe((data) => {
        this.getMessages(new MessageDTO(1, this.destinationId)); // author_id 1 - это заглушка, я поленился тогда видимо создать отдельную дто
        this.cdRef.markForCheck();
    });

    this.activatedRoute.paramMap.subscribe(params => {
          let data1 = params.get('id');
          let data: number = +data1.replace(':','');
          this.destinationId = data;
          this.getMessages(new MessageDTO(1, data));
      });

    this.getAvatarForMe(this.userId);
    this.getAvatarForDest(this.destinationId);

    // this.getMessages(new MessageDTO(1, this.destinationId));
    this.buildForm();
  }

  public getAvatarForMe(id): void {
      this.pictureService.getAvatar(id)
          .pipe(
              take(1)
          )
          .subscribe((data) => {
              this.userAvatar = data;
              this.cdRef.markForCheck();
          }
          ,error => console.log(error)
          );
  }

    public getAvatarForDest(id): void {
        this.pictureService.getAvatar(id)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                    this.destAvatar = data;
                    this.cdRef.markForCheck();
                }
                ,error => console.log(error)
            );
    }

    public getAvatarFor(id, variable): void {
        this.pictureService.getAvatar(id)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                    variable = data;
                    this.cdRef.markForCheck();
                }
                ,error => console.log(error)
            );
    }


  public getMessages(messDTO: MessageDTO): void {
    this.isDataReady = false;
    this.messagesService.GetMessages(messDTO)
        .subscribe((data: Message[]) => {
              this.messageArray = data;
              this.isDataReady = true;
              this.scrollDown();
              this.cdRef.markForCheck();
            },
            error => console.log(error)
        );
  }

  private buildForm(): void {
    this.chatControl = new FormControl('', [Validators.required]);
    this.chatForm = new FormGroup({
      chat: this.chatControl
    });
    this.chatForm.valueChanges
        .pipe(
            debounceTime(30)
        )
        .subscribe((data) => {
            this.textChat = data.chat;
            this.cdRef.markForCheck();
        });
  }

  public sendMessage(): void {
        this.messagesService.CreateMessage(new CreateMessageDto(this.destinationId, this.textChat))
            .subscribe((data) => {
                console.log('Sending status: ', data.stateMessage);
                if (data.state) {
                    this.messageArray.push(data.messageObject);
                }
                this.chatControl.setValue('');
                this.cdRef.markForCheck();
                setTimeout(() => {
                    this.scrollDown();
                }, 1);
            },
            error => console.log(error, 'ошибочка')
        );
    }

  public deleteMessage(message: Message): void {
      this.messagesService.DeleteMessage(message.messageId)
          .pipe(
              take(1)
          )
          .subscribe((data) => {
              console.log('Deleting status: ', data.message);
              if (data.state) {
                  const index = this.messageArray.indexOf(message, 0);
                  if (index > -1) {
                      this.messageArray.splice(index, 1);
                  }
              }
              this.cdRef.markForCheck();
          },
                  error => console.log(error, 'ошибочка')
          );
    }

    public navigateToUserPageById(id: number): void {
        this.navigationService.goToUserPage(id);
        this.scrollUp();
        this.cdRef.markForCheck();
    }

    public scrollDown(): void {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'auto'
        });
    }

    public scrollUp(): void {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    public goToDialogs(): void {
      this.navigationService.goToDialogs();
    }

}
