import axios from "axios";
import useAuthStore from "../context/useAuthContext";


//GET THE URL
const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

// Addting tokent to request
// TODO: if token is expired then direct calling the /refreshToken
axiosInstance.interceptors.request.use(
    (config) => {
    const token = useAuthStore.getState().token;
    console.log("[Axios Request] URL:", config.url);
    console.log("[Axios Request] Method:", config.method);
    console.log("[Axios Request] Token:", token ? "Exists" : "None");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("CONFIG", config);
        return config;
    },
    (error) => {
        console.log("ERRO FROM AXIOS", error)
        return Promise.reject(error);
    }
)

// Response interceptors - handle 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
            else prom.resolve(token);
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("GOING INSIDE INTERCEPTOR")
        const originalRequest = error.config;
        const authStore = useAuthStore.getState();

        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject})
                } )
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));

            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(`${API_URL}auth/refresh-token`,{},{withCredentials: true})
                const newAccessToken = refreshResponse.data.accessToken;
                authStore.setToken(newAccessToken);
                processQueue(null, newAccessToken);
                isRefreshing = false;

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            }
            catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                console.log("refreshError", refreshError);
                // Logout if refresh fails
                authStore.logout();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export {axiosInstance}
