import { instance, authInstance } from "@utils/Axios"

export const getAllGroup = async () => {
    const response = await authInstance.get(`/group`)
    return response
}

export const deleteMultiGroup = async (ids) => {
    const response = await authInstance.post(`/group-delete-multi`, { ids: ids })
    return response
}

export const updateGroup = async (id, data) => {
    const response = await authInstance.put(`/group/${id}`, data)
    return response
}

export const createGroup = async (data) => {
    const response = await authInstance.post(`/group/`, data)
    return response
}

export const getManagerGroup = async (id) => {
    const response = await authInstance.get(`/group/${id}/get-manager`)
    return response
}

export const getGroupByUser = async () => {
    const response = await authInstance.get(`/group/get-group-by-user`)
    return response
}

export const searchGroup = async (keyword) => {
    const response = await authInstance.get(`/search-group?keyword=${keyword}`)
    return response
}

export const addUserToGroup = async (groupId, userIds) => {
    const response = await authInstance.post(`/group/${groupId}/add-users`, { userIds: userIds })
    return response
}

export const removeUserGroup = async (groupId, userId) => {
    const response = await authInstance.post(`remove-user-from-group`,
        {
            user_id: userId,
            group_id: groupId
        })
    return response
}

export const addUserGroup = async (groupId, userId) => {
    const response = await authInstance.post(`add-user-to-group`,
        {
            user_id: userId,
            group_id: groupId
        })
    return response
}

export const getUserGroup = async (groupId) => {
    const response = await authInstance.get(`group/${groupId}/users`)
    return response
}
