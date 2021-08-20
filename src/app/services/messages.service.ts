import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageDTO } from '../entities/messageDTO';
import { CreateMessageDto } from '../entities/createMessageDto';

const baseUrl: string = 'https://localhost:44317';

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  constructor(private http: HttpClient) { }

  public GetMessages(messDto: MessageDTO): Observable<any> {
    const body = { authorId: messDto.authorId, destinationId: messDto.destinationId };
    return this.http.post(`${baseUrl}/api/MessagesApi/GetMessages`, body);
  }

  public GetLastMessages(userIds: number[]): Observable<any> {
    return this.http.post(`${baseUrl}/api/MessagesApi/GetLastMessages`, userIds);
  }

  public GetDialogs(messDto: MessageDTO): Observable<any> {
    const body = { authorId: messDto.authorId, destinationId: messDto.destinationId };
    return this.http.post(`${baseUrl}/api/MessagesApi/GetDialogs`, body);
  }

  public CreateMessage(createMessageDto: CreateMessageDto): Observable<any> {
    const body = {destinationId: createMessageDto.destinationId, message: createMessageDto.message};
    return this.http.post(`${baseUrl}/api/MessagesApi/CreateMessage`, body);
  }

  public DeleteMessage(id: number): Observable<any> {
    const body = {authorId: id, destinationId: id};
    return this.http.post(`${baseUrl}/api/MessagesApi/DeleteMessage`, body);
  }

  public GetUserData(id: number): Observable<any> {
    const body = {authorId: id, destinationId: id};
    return this.http.post(`${baseUrl}/api/MessagesApi/GetUserData`, body);
  }

}
