import { axiosInstance } from "../lib/axios";

// LOGIN USER
export const LoginUser = async(userData) => {
    const { data } = await axiosInstance.post("auth/login", userData);
    return data;
}

// AUTH USER ONLY TOKEN
export const VerifyUser = async() => {
    const { data } = await axiosInstance.get("auth/me");
    return data;
}

//Get All Request
export const GetRequest = async() => {
    const { data } = await axiosInstance.get("admin/instructor-request");
    return data.data;
}

//Accepnt Request
// @param: instructorID
// token in header
export const AcceptRequest = async(id) => {
    const { data } = await axiosInstance.patch(`admin/approve-instructor/${id}`);
    return data;
}

export const getInstructors = async(id) => {
    console.log("INSIDE API BEFORE");
    const { data } = await axiosInstance.get(`admin/instructor`);
    console.log("OUTSIDE API AFTER");

    return data.data;
}
