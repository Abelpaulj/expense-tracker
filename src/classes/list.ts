export interface Task {
  category: string;
  description: string | number;
  task_createdAt: string; // ISO date string
  amount: number;
  image: string;
}