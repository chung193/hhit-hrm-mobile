import { instance, authInstance } from "@utils/Axios"

export const getAllMeal = async (data) => {
    const response = await authInstance.get(`/meal`, data)
    return response
}

export const getMealOrderFilter = async (data) => {
    const response = await authInstance.post(`meal-get-order-filter`, data)
    return response
}

export const deleteMultiMeal = async (ids) => {
    const response = await authInstance.post(`/meal-delete-multi`, { ids: ids })
    return response
}

export const updateMeal = async (id, data) => {
    const response = await authInstance.put(`/meal/${id}`, data)
    return response
}

export const createMeal = async (data) => {
    const response = await authInstance.post(`/meal/`, data)
    return response
}

export const searchMeal = async (keyword) => {
    const response = await authInstance.get(`/search-meal?keyword=${keyword}`)
    return response
}

export const mealAddOrder = async (data) => {
    const response = await authInstance.post('meal-add-order', data)
    return response
}

export const mealOrderUser = async () => {
    const response = await authInstance.post('meal-order-user')
    return response
}
export const getMealStatic = async (data) => {
    const response = await authInstance.post('meal-order-static', data)
    return response
}

export const getMealStaticByDate = async (data) => {
    const response = await authInstance.post('meal-order-static-by-meal', data)
    return response
}
export const getMealReportGroup = async (data = null) => {
    if (data) {
        const response = await authInstance.get(`meal-report-group?from_date=${data.from_date}&to_date=${data.to_date}`)
        return response
    }
    const response = await authInstance.get('meal-report-group', data)
    return response
}

export const exportMealByDate = async (data) => {
    const response = await authInstance.post('meal-export', data,
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: 'blob'
        }
    )
    return response
}

export const checkin = async (data) => {
    const response = await authInstance.post('meal-check-in', data)
    return response
}

export const getRegisteredDates = async (data) => {
    const response = await authInstance.post('meal-registered-dates', data)
    return response
}

export const mealForCustomerCheckin = async (data = {}) => {
    const response = await authInstance.post(`/meal-for-customer-checkin`, data)
    return response
}

export const mealAddOrderAuto = async (data = {}) => {
    const response = await authInstance.post(`/meal-add-order-auto`, data)
    return response
}

