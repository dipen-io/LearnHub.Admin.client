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

export const getInstructors = async(params = {}) => {
    const {search = "", page = 1, limit = 30,} = params;
    // Build query string dynamically
    const query =  new URLSearchParams({
        search,
        page: String(page),
        limit: String(limit),
    });
    // const { data } = await axiosInstance.get(`admin/instructor`);
    const { data } = await axiosInstance.get(`admin/instructor?${query.toString()}`);
    return data;
}

export const getUsers = async(params) => {
    const {search = "", page = 1, limit = 30, type = "users"} = params;
    // Build query string dynamically
    const query =  new URLSearchParams({
        search,
        page: String(page),
        limit: String(limit),
        type,
    });
    const { data } = await axiosInstance.get(`users?${query.toString()}`);
    return data;
}

export const getStudents = async(params = {}) => {
    const {search = "", page = 1, limit = 30,} = params;
    // Build query string dynamically
    const query =  new URLSearchParams({
        search,
        page: String(page),
        limit: String(limit),
    });
    const { data } = await axiosInstance.get(`users?${query.toString()}`);
    return data;
}

export const updateUserStatus = async(params) => {
    const {status, userId } = params;
    // Build query string dynamically
    const query =  new URLSearchParams({
        status: String(status),
        userId: String(userId),
    });
    const { data } = await axiosInstance.patch(`admin/users/status?${query.toString()}`);
    return data;
}

// PATCH admin/user/status?status=active&userId=42
