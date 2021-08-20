import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WallPostCreateDTO } from '../entities/wallPostCreateDTO';
import { WallPostUpdateDTO } from '../entities/wallPostUpdateDTO';
import { WallPostRatingDTO } from '../entities/wallPostRatingDTO';
import { WallCommentCreateDTO } from '../entities/wallCommentCreateDTO';
import { WallCommentUpdateDTO } from '../entities/wallCommentUpdateDTO';
import { WallCommentRatingDTO } from '../entities/WallCommentRatingDTO';


const baseUrl: string = 'https://localhost:44317';

@Injectable({
  providedIn: 'root'
})
export class WallService {

  constructor(private http: HttpClient) { }

  public getAllWallPostsById(int: number): Observable<any> {
    const id: number = int;
    return this.http.post(`${baseUrl}/api/WallApi/GetAllWallPostsById`, id);
  }

  public getAllWallPostsForFeed(idArray: number[]): Observable<any> {
    // const id: number = int;
    return this.http.post(`${baseUrl}/api/WallApi/GetAllWallPostsForFeed`, idArray);
  }

  public createPost(postData: WallPostCreateDTO): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/CreatePost`, postData);
  }

  public deletePost(postId: number): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/DeletePost`, postId);
  }

  public updatePost(postData: WallPostUpdateDTO): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/UpdateWallPost`, postData);
  }

  public setWallPostRating(postData: WallPostRatingDTO): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/WallPostRating`, postData);
  }

  public setWallCommentRating(postData: WallCommentRatingDTO): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/WallCommentRating`, postData);
  }

  public createComment(postData: WallCommentCreateDTO): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/CreateComment`, postData);
  }

  public deleteComment(commentId: number): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/DeleteComment`, commentId);
  }

  public updateComment(commentData: WallCommentUpdateDTO): Observable<any> {
    return this.http.post(`${baseUrl}/api/WallApi/UpdateWallComment`, commentData);
  }

}
