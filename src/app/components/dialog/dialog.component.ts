import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { MessageDTO } from '../../entities/messageDTO';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { UserData } from '../../entities/userData';
import { PictureService } from '../../services/picture.service';
import { AvatarAndId } from '../../entities/avatarAndId';
import { Message } from '../../entities/message';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DialogComponent implements OnInit {

  public messageDTO: MessageDTO = new MessageDTO(1, 1); // id не важен, бек ищет сообщения для пользователя по auth_token

  public userArray: UserData[];
  public userIdAndAvaArray: AvatarAndId[] = [];
  public mapIdAndLastMessage: Map<number, Message> = new Map();
  public isUserDataReady: boolean = false;

  constructor(private messagesService: MessagesService, private cdRef: ChangeDetectorRef, private ngZone: NgZone,
              private router: Router, private eventsService: EventsService,
              private pictureService: PictureService) {

  }

  ngOnInit(): void {
      this.loadDataForkJoin(this.messageDTO);
  }

    public loadDataForkJoin(messageDTO: MessageDTO): void {
        this.messagesService.GetDialogs(messageDTO)
            .subscribe((data) => {
                    this.userArray = data;
                    const userIdArray: number[] = [];
                    data.forEach((item) => {
                        userIdArray.push(item.id);
                    });
                    forkJoin(this.pictureService.getAvatarCollection(userIdArray), this.messagesService.GetLastMessages(userIdArray))
                        .pipe(
                            tap(([avatarCollection, lastMessagesArray]) => {
                                for(let key in avatarCollection) {
                                    this.userIdAndAvaArray.push(new AvatarAndId(Number(key), avatarCollection[key]));
                                }
                                for(let key in lastMessagesArray) {
                                    this.mapIdAndLastMessage.set(Number(key), lastMessagesArray[key]);
                                }
                                this.isUserDataReady = true;
                                this.cdRef.markForCheck();
                            })
                        )
                        .subscribe();
                },
                error => console.log(error)
            );
    }

    public transitToMessages(id: number): void {
        this.cdRef.markForCheck();
        this.openDialogWith(id);
        setTimeout(() => {
            this.eventsService.changeMessId.emit(id);
        }, 1);
        this.cdRef.markForCheck();
    }

    public openDialogWith(id: number): void  {
        this.router.navigate([`/messages/:${id}/`]);
    }
}
