// Message type - stored in Firestore
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  readBy: string[];
}

// Last seen tracking - stored in Firestore
export interface LastSeen {
  userId: string;
  chatId: string;
  messageId: string;
  updatedAt: Date;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | string[];
}
