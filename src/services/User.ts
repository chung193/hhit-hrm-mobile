
import { instance, authInstance } from "@utils/Axios"

export const profile = async () => {
    const response = await authInstance.get(`/profile`)
    return response
}

export const getAllUser = async () => {
    const response = await authInstance.get(`/get-all-user`)
    return response
}

export const deleteMultiUser = async (ids) => {
    const response = await authInstance.post(`/user-delete-multi`, { ids: ids })
    return response
}

export const updateUser = async (id, data) => {
    const response = await authInstance.put(`/user/${id}`, data)
    return response
}

export const createUser = async ({ code, name, email, password, group_id, role_id }) => {
    const response = await authInstance.post(`/user`, { code, name, email, password, group_id, role_id })
    return response
}

export const resetDefaultPassword = async (id) => {
    const response = await authInstance.post(`/reset-password-default`, { id: id })
    return response
}

export const updateUserAvatar = async (formData) => {
    const response = await authInstance.post(`/user-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return response
}


export const getWorkSchedule = async (userId, data) => {
    const response = await authInstance.post(`/get-work-schedule-user/${userId}`, data)
    return response
}

export const getPersonalWorkSchedule = async () => {
    const response = await authInstance.get(`/get-personal-work-schedule`)
    return response
}



export const addWorkSchedule = async (data) => {
    const response = await authInstance.post(`/work-schedules`, data)
    return response
}

export const updateWorkSchedule = async (id, data) => {
    const response = await authInstance.put(`/work-schedules/${id}`, data)
    return response
}

export const deleteWorkSchedule = async (id) => {
    const response = await authInstance.delete(`/work-schedules/${id}`)
    return response
}

export const getWorkScheduleGroup = async (groupId, data) => {
    const response = await authInstance.post(`/get-work-schedule-group/${groupId}`, data)
    return response
}

export const searchUser = async (keyword) => {
    const response = await authInstance.get(`/user-search?keyword=${keyword}`)
    return response
}

export const activeUser = async (id) => {
    const response = await authInstance.get(`/active-user/${id}`)
    return response
}

export const deactiveUser = async (id) => {
    const response = await authInstance.get(`/deactive-user/${id}`)
    return response
}

export const importUser = async (formData) => {
    const response = await authInstance.post(`/import-user`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return response
}