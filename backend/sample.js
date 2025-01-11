const express = require('express')
const { open } = require('sqlite')
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()

const db = new sqlite3.Database('./roxiler.db')

const dbPath = path.join(__dirname, 'roxiler.db')

async function getData() {
    const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    const response = await axios.get(apiUrl)
    const data = response.data
    return data
}

async function createTable(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INT NOT NULL PRIMARY KEY,
            title TEXT,
            price FLOAT,
            description TEXT,
            category TEXT,
            image_url TEXT,
            sold BOOLEAN,
            date_of_sale TEXT
        );
    `)
}

async function insertRows(db) {
    const data = await getData()
    db.serialize(() => {
        let sql = `
        INSERT INTO products(id, title, price, description, category, image_url, sold, date_of_sale)
        VALUES(?,?,?,?,?,?,?,?)
        `
        data.forEach(item => {
            db.run(sql, Object.values(item))
        })
    })
}

async function initializeDbAndServer(db) {
    createTable(db)
    insertRows(db)

    // Dynamically set the port (either from environment or fallback to 3000)
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Server Running at http://localhost:${port}/`);
    });
}
initializeDbAndServer(db)

app.get('/', async (request, response) => {
    db.all(`SELECT * FROM products WHERE id = 2;`, [], (err, rows) => {
        if (err) {
            response.status(500).send({ error: err.message })
            return;
        }
        response.send(rows)
    })
})
