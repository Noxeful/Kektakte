import { EventEmitter, Injectable } from '@angular/core';
import { WallComment } from '../entities/wallComment';
import { WallPost } from '../entities/wallPost';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  public changeNameEvent = new EventEmitter<string>();
  public changeLogRegButton = new EventEmitter<boolean>();
  public changeMessId = new EventEmitter<number>();
  public messagesChanged = new EventEmitter();
  public reloadDataEvent = new EventEmitter();
  public scrollDownEvent = new EventEmitter();
  public reloadFriendsEvent = new EventEmitter<number>();
  public deleteCommentEvent = new EventEmitter<number>();
  public updateCommentEvent = new EventEmitter<WallComment>();
  public createCommentEvent = new EventEmitter<WallComment>();
  public postRatingEvent = new EventEmitter<WallPost>();

  constructor() { }
}
