import { instance, authInstance } from "@utils/Axios"

export const getAllCatalogRequest = async () => {
    const response = await authInstance.get(`/catalog-request`)
    return response
}

export const deleteMultiCatalogRequest = async (ids) => {
    const response = await authInstance.post(`/catalog-request-delete-multi`, { ids: ids })
    return response
}

export const updateCatalogRequest = async (id, data) => {
    const response = await authInstance.put(`/catalog-request/${id}`, data)
    return response
}

export const createCatalogRequest = async (data) => {
    const response = await authInstance.post(`/catalog-request/`, data)
    return response
}

export const searchCatalogRequest = async (keyword) => {
    const response = await authInstance.get(`/search-catalog-request?keyword=${keyword}`)
    return response
}

export const importCatalogRequest = async (data) => {
    const response = await authInstance.post(`/catalog-request-upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return response
}