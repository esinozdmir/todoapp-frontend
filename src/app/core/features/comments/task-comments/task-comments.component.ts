import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../../models/comment.model';
import { CommentService } from '../../../services/comment.service';


@Component({
  selector: 'app-task-comments',
  standalone: true,
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.css'],
  imports: [CommonModule, FormsModule]
})
export class TaskCommentsComponent implements OnInit {
  @Input() taskId!: number;
  comments: Comment[] = [];
  newCommentContent = '';
  currentUserId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getCommentsByTaskId(this.taskId).subscribe((data) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.newCommentContent.trim()) return;

    const newComment: Comment = {
      content: this.newCommentContent.trim(),
      taskId: this.taskId,
      userId: this.currentUserId,
    };

    this.commentService.addComment(newComment).subscribe(() => {
      this.newCommentContent = '';
      this.loadComments();
    });
  }

  deleteComment(id: number) {
    if (confirm('Yorumu silmek istiyor musunuz?')) {
      this.commentService.deleteComment(id).subscribe(() => {
        this.loadComments();
      });
    }
  }
}
