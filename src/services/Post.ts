import { instance, authInstance } from "@utils/Axios"

export const getAllPost = async () => {
    const response = await authInstance.get(`/post`)
    return response
}

export const getPost = async (id) => {
    const response = await authInstance.get(`/post/${id}`)
    return response
}

export const deleteMultiPost = async (ids) => {
    const response = await authInstance.post(`/post-delete-multi`, { ids: ids })
    return response
}

export const updatePost = async (id, data) => {
    const response = await authInstance.put(`/post/${id}`, data)
    return response
}

export const createPost = async (data) => {
    const response = await authInstance.post(`/post`, data)
    return response
}

export const searchPost = async (keyword) => {
    const response = await authInstance.get(`/post-search?keyword=${keyword}`)
    return response
}