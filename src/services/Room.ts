import { instance, authInstance } from "@utils/Axios"

export const getAll = async () => {
    const response = await authInstance.get(`/room`)
    return response
}

export const updateItem = async (id, data) => {
    const response = await authInstance.put(`/room/${id}`, data)
    return response
}

export const addItem = async (data) => {
    const response = await authInstance.post(`/room`, data)
    return response
}

export const deleteItem = async (id) => {
    const response = await authInstance.delete(`/room/${id}`)
    return response
}

export const deleteMulti = async (ids) => {
    const response = await authInstance.post(`/room-delete-multi`, { ids: ids })
    return response
}

export const searchRoom = async (keyword) => {
    const response = await authInstance.get(`/room-search?keyword=${keyword}`)
    return response
}
