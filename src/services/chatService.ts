import axiosServices from '../utils/axiosConfig';
import { Room, Message, CreateRoomRequest, SendMessageRequest } from '../types/index';

export const chatService = {
  getRooms: async () => {
    const response = await axiosServices.get('/rooms/');
    return response.data;
  },

  createRoom: async (roomData: CreateRoomRequest) => {
    const { invitedUsers, ...roomInfo } = roomData;
    const payload = {
      ...roomInfo,
      emails: invitedUsers
    };
    const response = await axiosServices.post('/rooms/', payload);
    
    return response.data;
  },

  getMessages: async (roomId: string) => {
    const response = await axiosServices.get(`/api/chat/rooms/${roomId}/messages/`);
    return response.data;
  },

  sendMessage: async ({ roomId, message }: SendMessageRequest) => {
    const response = await axiosServices.post(`/api/chat/rooms/${roomId}/messages/`, { message });
    return response.data;
  },

  inviteToRoom: async ({ roomId, emails }: { roomId: string; emails: string[] }) => {
    const response = await axiosServices.post(`/api/chat/rooms/${roomId}/invite/`, { emails });
    return response.data;
  },

  deleteRoom: async (roomId: string) => {
    const response = await axiosServices.delete(`/rooms/${roomId}/`);
    return response.data;
  },
};