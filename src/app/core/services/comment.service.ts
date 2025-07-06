import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  getCommentsByTaskId(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`);
  }

  addComment(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
}
