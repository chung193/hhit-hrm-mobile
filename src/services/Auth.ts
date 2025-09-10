import { instance, authInstance } from "@utils/Axios"

/* authentication */
export const login = async (data) => {
    const response = await instance.post('login', data)
    return response
}

export const register = async (data) => {
    const response = await instance.post('register', data)
    return response
}

export const forgot = async (data) => {
    const response = await instance.post('forgot-password', data)
    return response
}

export const resetPassword = async (data) => {
    const response = await instance.post('update-password', data)
    return response
}

export const changePassword = async (data) => {
    const response = await authInstance.post('change-password', data)
    return response
}

export const verifyEmail = async (id, hash) => {
    const response = await instance.get(`/email/verify/${id}/${hash}`);
    return response
}
