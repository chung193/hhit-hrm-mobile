import { instance, authInstance } from "@utils/Axios"

export const getAllRequest = async () => {
    const response = await authInstance.get(`/request`)
    return response
}

export const deleteMultiRequest = async (ids) => {
    const response = await authInstance.post(`/request-delete-multi`, { ids: ids })
    return response
}

export const updateRequest = async (id, data) => {
    const response = await authInstance.put(`/request/${id}`, data)
    return response
}

export const createRequest = async (data) => {
    const response = await authInstance.post(`/request`, data)
    return response
}

export const getRequest = async (id) => {
    const response = await authInstance.get(`/request/${id}`)
    return response
}

export const searchRequest = async (keyword) => {
    const response = await authInstance.get(`/search-request?keyword=${keyword}`)
    return response
}

export const importRequest = async (data) => {
    const response = await authInstance.post(`/request-upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return response
}

export const getRequestByUserApprove = async () => {
    const response = await authInstance.get(`requests-by-user-approve`)
    return response
}
