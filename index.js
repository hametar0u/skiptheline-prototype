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
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
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
    
  })
  .post('/login',  (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var loginQuery = `select * from users where users.username = '${username}'`;
    pool.query(loginQuery, (error, result) => {
        if (error)
            res.send(error);
        else {
            results = {'rows': result.rows };
            if (results.rows === undefined || results.rows.length == 0){
                res.redirect("failure.html");
                //tell user email/password is wrong -> redirect to another page/go back to the beginning
            }
            
            else{
                //check password
                databasepassword = results.rows[0].password;
                if (databasepassword === loginPassword){
                    res.redirect("success.html");}
                    //redirect to main page, display "logged in as {username}"
                else{
                    res.redirect("failure.html");}
                    //tell user email/password is wrong -> redirect to another page/go back to the beginning
            }
        }
    
    });
})


  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


