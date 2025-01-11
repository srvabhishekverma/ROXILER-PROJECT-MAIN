const BASE_URl = true ? 'https://roxiler-backend-3nx7.onrender.com/' : 'http://localhost:3000/'

const EndPoints = {
    TRANSACTIONS: (searchText, month, pageNum) => (BASE_URl + `transactions/?search=${searchText}&month=${month}&page=${pageNum}&pageSize=10`),
    SALES: (month) => (BASE_URl + `statistics/sales/?month=${month}`),
    PRICE_RANGE: (month) => (BASE_URl + `statistics/price-range/?month=${month}`),
    UNIQUE_CATEGORY: (month) => (BASE_URl + `statistics/unique-category/?month=${month}`),
}

Object.freeze(EndPoints)

export { EndPoints }