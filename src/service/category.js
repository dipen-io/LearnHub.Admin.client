import { axiosInstance } from "../lib/axios";

// Create Category
export const CreateCategory = async(categoryData) => {
    const { data } = await axiosInstance.post("category/new", categoryData);
    return data;
}

// Get Category
export const GetCategory = async(search) => {
    const query = new URLSearchParams({
        search
    })
    const { data } = await axiosInstance.get(`category?${query.toString()}`);
    console.log("DATA", data);
    return data
}

// Remove Category
export const RemoveCategory = async(categoryId) => {
    const { data } = await axiosInstance.delete(`category/remove/${categoryId}`);
    return data;
}

// Update Category
export const UpdateCategory = async({ id, updatedData }) => {
    const { data } = await axiosInstance.patch(`category/update/${id}`, updatedData );
    return data.data;
}

// Single Category
export const GetSingleCategory = async( categoryId) => {
    const { data } = await axiosInstance.get(`category/single/${categoryId}`);
    return data.data;
}
