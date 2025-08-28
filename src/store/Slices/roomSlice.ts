import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Room {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
}

const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  loading: false,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action: PayloadAction<Room>) => {
      state.rooms.push(action.payload);
    },
    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setRooms, addRoom, setCurrentRoom, setLoading } = roomSlice.actions;
export default roomSlice.reducer;