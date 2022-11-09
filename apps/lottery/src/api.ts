import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ticketInterface, userInterface } from '@turbo-lottery/data';
import { FieldValues } from 'react-hook-form';

export const api = createApi({
  reducerPath: 'Api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env['NX_REACT_APP_BACKEND'],

    // prepareHeaders: async (headers) => {
    //   // if (auth.currentUser) {
    //     const token = useSelector((state: RootState) => state.user.token);
    //   headers.set('Authorization', `Bearer ${token}`);
    //   // }
    //   return headers;
    // },
  }),
  tagTypes: ['allTickets', 'allUsers'],
  endpoints: (build) => ({
    register: build.mutation<any, FieldValues>({
      query: (body) => ({
        headers: {
          'Content-type': 'application/json',
        },
        url: '/auth/register',
        method: 'POST',
        body: JSON.stringify(body),
      }),
      invalidatesTags: ['allTickets', 'allUsers'],
    }),

    login: build.mutation<any, FieldValues>({
      query: (body) => ({
        url: `/auth/login`,
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
        },
      }),
      invalidatesTags: ['allTickets', 'allUsers'],
    }),

    getTickets: build.query<ticketInterface[], string | null>({
      query: (token) => ({
        url: '/ticket',
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['allTickets'],
    }),

    getUsers: build.query<userInterface[], string | null>({
      query: (token) => ({
        url: '/user',
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['allUsers'],
    }),

    createTicket: build.mutation<any, FieldValues>({
      query: ({ body, token }) => ({
        url: `/ticket`,
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['allTickets'],
    }),
    updateTicket: build.mutation<any, FieldValues>({
      query: ({ body, token, ticketId }) => ({
        url: `/ticket/${ticketId}`,
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['allTickets'],
    }),
    deleteTicket: build.mutation<any, any>({
      query: ({ token, ticketId }) => ({
        url: `/ticket/${ticketId}`,
        method: 'DELETE',
        // body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['allTickets'],
    }),
    updateUser: build.mutation<any, FieldValues>({
      query: ({ body, token, userId }) => ({
        url: `/user/${userId}`,
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['allUsers'],
    }),
  }),
});
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetTicketsQuery,
  useGetUsersQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useUpdateUserMutation,
  useDeleteTicketMutation,
} = api;
