import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface Breed {
  id: string;
  name: string;
  image: {
    url: string;
  };
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.thedogapi.com/vi',
    prepareHeaders: headers => {
      headers.set('x-api-key', process.env.DOGS_API_KEY ?? '');
      return headers;
    },
  }),
  endpoints: builder => ({
    fetchBreeds: builder.query<Breed[], number | void>({
      query: (limit = 10) => `/breeds?limit=${limit}`,
    }),
  }),
});

export const {useFetchBreedsQuery} = apiSlice;
