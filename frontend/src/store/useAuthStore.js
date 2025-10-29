import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check")
            set({ authUser: response.data })

            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth: ", error);

            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("/auth/signup", data)
            set({ authUser: response.data })
            toast.success("Account created successfully!")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        try {
            const response = await axiosInstance.post("/auth/login", data)
            set({ authUser: response.data })
            toast.success("Logged in successfully!")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },



    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: response.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect()

        set({ socket: socket })

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: async () => {
        if (get().socket?.connected()) get().socket.disconnectSocket()
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            get().socket?.disconnect()
            set({ authUser: null, socket: null })
        }
    }
}))