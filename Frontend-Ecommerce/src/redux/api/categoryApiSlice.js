import { apiSlice } from "./apiSlice.js";
import { CATEGORY_URL } from "../constants.js";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all categories
    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/categories`,
      providesTags: ["Category"],   // 👈 provide cache tag
    }),

    // Create a new category
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"], // 👈 invalidate cache so fetch runs again
    }),

    // Update category
    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ["Category"], // 👈 refetch after update
    }),

    // Delete category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], // 👈 refetch after delete
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;
