const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
                      });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.redirect('login.html'))
  .get('/users', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM users');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/users', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/orders', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM orders');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/orders', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/order_details', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM order_details');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/order_details', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
 //.post
  })


  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


