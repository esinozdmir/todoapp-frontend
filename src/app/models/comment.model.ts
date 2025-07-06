export interface Comment {
  id?: number;
  content: string;
  createdAt?: Date;
  taskId: number;
  userId: number;
  authorFullName?: string;
}
