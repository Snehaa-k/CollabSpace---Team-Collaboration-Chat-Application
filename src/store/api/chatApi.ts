import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Room {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface CreateRoomRequest {
  name: string;
  description: string;
  invitedUsers: string[];
}

interface SendMessageRequest {
  roomId: string;
  message: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/chat',
    credentials: 'include',
  }),
  tagTypes: ['Room', 'Message'],
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => '/rooms',
      providesTags: ['Room'],
    }),
    createRoom: builder.mutation<Room, CreateRoomRequest>({
      query: (roomData) => ({
        url: '/rooms',
        method: 'POST',
        body: roomData,
      }),
      invalidatesTags: ['Room'],
    }),
    getMessages: builder.query<Message[], string>({
      query: (roomId) => `/rooms/${roomId}/messages`,
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: ({ roomId, message }) => ({
        url: `/rooms/${roomId}/messages`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Message'],
    }),
    inviteToRoom: builder.mutation<{ message: string }, { roomId: string; emails: string[] }>({
      query: ({ roomId, emails }) => ({
        url: `/rooms/${roomId}/invite`,
        method: 'POST',
        body: { emails },
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const { 
  useGetRoomsQuery, 
  useCreateRoomMutation, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useInviteToRoomMutation
} = chatApi;