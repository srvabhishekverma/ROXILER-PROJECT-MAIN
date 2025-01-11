import { EndPoints } from "./ApiEndpoints";

export const getTransactions = async (searchText, month, pageNum) => {
    try {
        const response = await fetch(EndPoints.TRANSACTIONS(searchText, month, pageNum))
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)

    }
}

export const getStatistics = async (month) => {
    try {
        const response = await fetch(EndPoints.SALES(month))
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

export const getStatisticsPriceRange = async (month) => {
    try {
        const response = await fetch(EndPoints.PRICE_RANGE(month))
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

export const getStatisticsUniqueCategory = async (month) => {
    try {
        const response = await fetch(EndPoints.UNIQUE_CATEGORY(month))
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}