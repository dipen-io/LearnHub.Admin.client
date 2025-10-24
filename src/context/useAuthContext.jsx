import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,

            login: (userData, token) => set(() => ({ user: userData, token })),
            logout: () => set(() => ({ user: null, token: null })),
            setToken: (token) => set(() => ({ token })),
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage,
        }))

export default useAuthStore;
