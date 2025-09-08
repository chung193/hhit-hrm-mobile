import { instance, authInstance } from "@utils/Axios"

export const getAll = async () => {
    const response = await authInstance.get(`/meal-rate`)
    return response
}

export const deleteRate = async (id) => {
    const response = await authInstance.delete(`/meal-rate/${id}`)
    return response
}

export const createNew = async (data) => {
    const response = await authInstance.post(`/meal-rate`, data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    return response
}