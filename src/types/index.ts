export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isTask?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'group' | 'direct';
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: string;
  members?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'deadline-over';
  priority: 'low' | 'medium' | 'high';
  isShared: boolean;
  chatId: string;
  createdBy?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}