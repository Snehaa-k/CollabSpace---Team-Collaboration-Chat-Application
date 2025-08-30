import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/chatService';
import { Room, Message } from '../../types/index';

interface ChatState {
  rooms: Room[];
  messages: { [roomId: string]: Message[] };
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  rooms: [],
  messages: {},
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk(
  'chat/fetchRooms',
  async () => {
    console.log('fetchRooms thunk called');
    try {
      const result = await chatService.getRooms();
      console.log('fetchRooms result:', result);
      console.log('Returning from thunk:', result);
      return result;
    } catch (error) {
      console.error('fetchRooms thunk error:', error);
      throw error;
    }
  }
);

export const createRoom = createAsyncThunk(
  'chat/createRoom',
  async (roomData: { name: string; description: string; invitedUsers: string[] }) => {
    return await chatService.createRoom(roomData);
  }
);

export const deleteRoom = createAsyncThunk(
  'chat/deleteRoom',
  async (roomId: string) => {
    await chatService.deleteRoom(roomId);
    return roomId;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (roomId: string) => {
    const messages = await chatService.getMessages(roomId);
    return { roomId, messages };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, message }: { roomId: string; message: string }) => {
    const newMessage = await chatService.sendMessage({ roomId, message });
    return { roomId, message: newMessage };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        console.log('fetchRooms fulfilled - action:', action);
        console.log('fetchRooms fulfilled - payload:', action.payload);
        console.log('fetchRooms fulfilled - payload type:', typeof action.payload);
        console.log('fetchRooms fulfilled - is array:', Array.isArray(action.payload));
        state.loading = false;
        state.rooms = Array.isArray(action.payload) ? action.payload : [];
        console.log('Updated rooms in state:', state.rooms);
        console.log('State after update:', JSON.stringify(state));
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
        console.error('fetchRooms rejected:', action.error);
      })
      // Create Room
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create room';
      })
      // Delete Room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
      })
      // Messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages[action.payload.roomId] = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { roomId, message } = action.payload;
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
        state.messages[roomId].push(message);
      });
  },
});

export default chatSlice.reducer;