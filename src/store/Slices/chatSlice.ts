import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
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

interface ChatState {
  selectedChat: Conversation | null;
  conversations: Conversation[];
  messages: Message[];
  loading: boolean;
}

const initialState: ChatState = {
  selectedChat: null,
  conversations: [],
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<Conversation>) => {
      state.selectedChat = action.payload;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSelectedChat, setConversations, addMessage, setMessages, setLoading } = chatSlice.actions;
export default chatSlice.reducer;