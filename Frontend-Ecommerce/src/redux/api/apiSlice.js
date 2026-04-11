import {fetchBaseQuery ,createApi} from '@reduxjs/toolkit/query/react'
// import { BASE_URL } from '../constants.js'

const baseQuery = fetchBaseQuery({

  baseUrl: 'https://ecomerse-3.onrender.com',
  credentials: 'include',
})

export const apiSlice = createApi({
  baseQuery,
  
  tagTypes:['Product' , 'Orders' ,'User','Category'],
  endpoints:()=>({}),
})
