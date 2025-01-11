const express = require('express')
const { open } = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const axios = require('axios');

const app = express()
app.use(cors()) //Cross Origin Resource Sharing

const dbPath = path.join(__dirname, 'roxiler.db')
let db

const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log(`Server Running at http://localhost:3000/`)
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`)
        process.exit(1)
    }
}
initializeDbAndServer()

//API - 1 All Transactions with Pagination and Search 
app.get('/transactions/', async (request, response) => {
    try {
        const { month = 3, page = 1, pageSize = 10, search = '' } = request.query

        const monthFilter = month ? `ltrim(strftime('%m', date_of_sale), '0') = '${month}'` : '1=1'
        const query = `
            SELECT * FROM products
            WHERE ${monthFilter} AND
            ((title LIKE '%${search}%') OR 
            (description LIKE '%${search}%') OR
            (price = '${search}'))
            LIMIT ${pageSize}
            OFFSET ${(page - 1) * pageSize}
        `
        const data = await db.all(query)

        const totalCountQuery = `
            SELECT COUNT(*) as totalCount
            FROM products
            WHERE ${monthFilter} AND
            ((title LIKE '%${search}%') OR 
            (description LIKE '%${search}%') OR
            (price = '${search}'))
        `;
        const { totalCount } = await db.get(totalCountQuery)
        const totalPages = Math.ceil(totalCount / pageSize)
        const hasNextPage = page < totalPages


        response.send({
            data,
            hasNextPage,
        })
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        response.status(500).send('Internal Server Error')
    }
})

//API - 2  Statistics Data of Sales

app.get('/statistics/sales/', async (request, response) => {
    try {
        const { month = 3 } = request.query
        const monthFilter = month ? `ltrim(strftime('%m', date_of_sale), '0') = '${month}'` : '1=1'

        const query = `
            SELECT 
                SUM(CASE WHEN sold = 1 THEN price ELSE 0 END) As totalSale,
                SUM(CASE WHEN sold = 1 THEN 1 ELSE 0 END) As totalSold,
                SUM(CASE WHEN sold = 0 THEN 1 ELSE 0 END) As totalNotSold
            FROM products
            WHERE ${monthFilter}
        `
        const statistics = await db.get(query)
        response.send(statistics)

    } catch (error) {
        console.error(`API Error: ${error.message}`);
        response.status(500).send('Internal Server Error')
    }
})

//API - 3 Statistics Data of products with price range

app.get('/statistics/price-range/', async (request, response) => {
    try {
        const { month = 3 } = request.query
        const monthFilter = month ? `ltrim(strftime('%m', date_of_sale), '0') = '${month}'` : '1=1'
        const query = `
            SELECT price
            FROM products
            WHERE ${monthFilter}
        `
        const data = await db.all(query)
        const priceRanges = Array(10).fill(0)
        data.forEach(({ price }) => {
            if (price >= 0 && price <= 100) {
                priceRanges[0] += 1;
            } else if (price >= 101 && price <= 200) {
                priceRanges[1] += 1;
            } else if (price >= 201 && price <= 300) {
                priceRanges[2] += 1;
            } else if (price >= 301 && price <= 400) {
                priceRanges[3] += 1;
            } else if (price >= 401 && price <= 500) {
                priceRanges[4] += 1;
            } else if (price >= 501 && price <= 600) {
                priceRanges[5] += 1;
            } else if (price >= 601 && price <= 700) {
                priceRanges[6] += 1;
            } else if (price >= 701 && price <= 800) {
                priceRanges[7] += 1;
            } else if (price >= 801 && price <= 900) {
                priceRanges[8] += 1;
            } else {
                priceRanges[9] += 1
            }
        })
        response.send(priceRanges)
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        response.status(500).send('Internal Server Error')
    }
})

//API -4 Statistics Data of products with unique category
app.get('/statistics/unique-category/', async (request, response) => {
    try {
        const { month = 3 } = request.query
        const monthFilter = month ? `ltrim(strftime('%m', date_of_sale), '0') = '${month}'` : '1=1'

        const query = `
            SELECT category, COUNT(*) As itemCount
            FROM products
            WHERE ${monthFilter}
            GROUP BY category
        `
        const data = await db.all(query)
        response.send(data)
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        response.status(500).send('Internal Server Error')
    }
})

//API-5 Aggregated Api call for Combined Data

app.get('/aggregated-data/', async (request, response) => {
    try {
        const { month = 3, page = 1, pageSize = 10, search = '' } = request.query

        const transactionsUrl = `https://roxiler-backend-3nx7.onrender.com/transactions?search=${search}&month=${month}&page=${page}&pageSize=10`;
        const statisticsUrl = `https://roxiler-backend-3nx7.onrender.com/statistics/sales?month=${month}`;
        const barChartDataUrl = `https://roxiler-backend-3nx7.onrender.com/statistics/price-range?month=${month}`;
        const categoryDataUrl = `https://roxiler-backend-3nx7.onrender.com/statistics/unique-category?month=${month}`;

        const [transactionsData, statisticsData, barChartData, categoryData] = await Promise.all([
            axios.get(transactionsUrl).then(response => response.data),
            axios.get(statisticsUrl).then(response => response.data),
            axios.get(barChartDataUrl).then(response => response.data),
            axios.get(categoryDataUrl).then(response => response.data)
        ]);

        const aggregatedData = {
            transactionsData,
            statisticsData,
            barChartData,
            categoryData,
        };
        response.send(aggregatedData)
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        response.status(500).send('Internal Server Error')
    }
})