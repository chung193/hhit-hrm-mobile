import { instance, authInstance } from "@utils/Axios"

export const getAll = async () => {
    const response = await authInstance.get(`booking-room`)
    return response
}

export const addItem = async (data) => {
    const response = await authInstance.post(`booking-room`, data)
    return response
}

export const filter = async (data) => {
    const response = await authInstance.post(`booking-room-filter`, data)
    return response
}

export const statics = async (data) => {
    const response = await authInstance.post(`booking-room-statics`, data)
    return response
}

export const approveBooking = async (data) => {
    const response = await authInstance.post(`approve-booking-room`, data)
    return response
}
