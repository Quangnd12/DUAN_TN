import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/Api_url";

export const determineEventStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Kiểm tra trạng thái với độ chính xác cao
  const nowTime = now.getTime();
  const startTimeMs = start.getTime();
  const endTimeMs = end.getTime();

  // Kiểm tra trạng thái
  if (nowTime < startTimeMs) {
    return 'upcoming';
  } else if (nowTime >= startTimeMs && nowTime <= endTimeMs) {
    return 'ongoing';
  } else {
    return 'completed';
  }
};

const autoUpdateEventStatus = (events) => {
  return events.map(event => ({
    ...event,
    status: determineEventStatus(event.startTime, event.endTime)
  }));
};

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (formData) => ({
        url: '/events',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Event']
    }),
    

    getAllEvents: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 5,
          search = '',
          status = null,
          eventCategory = null,
          sort = 'createdAt',
          order = 'DESC'
        } = params;

        return {
          url: '/events',
          params: {
            page,
            limit,
            ...(search && { search }),
            ...(status && { status }),
            ...(eventCategory && { eventCategory }),
            sort,
            order
          }
        };
      },
      transformResponse: (response) => {
        // Cập nhật trạng thái cho từng sự kiện
        const eventsWithDynamicStatus = autoUpdateEventStatus(response.events);

        return {
          events: eventsWithDynamicStatus,
          total: response.total,
          page: response.page,
          totalPages: response.totalPages,
          limit: response.limit
        };
      },
      providesTags: (result, error, params) => {
        const { page = 1, search = '', status = '', eventCategory = '' } = params;
        return result?.events
          ? [
              ...result.events.map(({ id }) => ({ type: 'Event', id })),
              { type: 'Event', id: `LIST-${page}-${search}-${status}-${eventCategory}` }
            ]
          : [{ type: 'Event', id: 'LIST' }];
      }
    }),

    getAllArtists: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 20 } = params;
        return `/artists?page=${page}&limit=${limit}`;
      },
      transformResponse: (response) => {
        return {
          artists: response.artists || [],
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 0,
          totalCount: response.totalCount || 0
        };
      },
      providesTags: ['Artist']
    }),

    getEvent: builder.query({
      query: (id) => `/events/${id}`,
      transformResponse: (response) => ({
        ...response,
        status: determineEventStatus(response.startTime, response.endTime)
      }),
      providesTags: (result, error, id) => [{ type: 'Event', id }]
    }),

    updateEvent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' }
      ]
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' }
      ]
    })
  })
});

export const {
  useCreateEventMutation,
  useGetAllEventsQuery,
  useGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetAllArtistsQuery 
} = eventApi;