const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
                      });
const session = require('express-session');



function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
    res.redirect("login.html")
  } else {
    next();
  }
}





express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(session({
    secret:"skiptheline"
    //user_id: ""
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.redirect('login.html'))
  .get('/login', (req, res) => res.redirect('login2.html'))
  .get('/orderhistory', (req, res) => res.redirect('order_history.html'))
  .get('/pendingorders', (req, res) => res.redirect('pending_orders.html'))
  .get('/my_secret_page', checkAuth, function (req, res) {
    res.send('if you are viewing this page it means you are logged in');
  })
  .get('/signup', (req, res) => res.redirect('sign_up.html'))
  .get('/confirmorder', (req, res) => res.redirect('confirm_order.html'))
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
    var loginUsername = req.body.username;
    var loginPassword = req.body.password;
    var loginQuery = `select * from users where users.username = '${loginUsername}'`;
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
                    req.session.user_id = makeid(10);
                    console.log('user id: '+req.session.user_id);
                    res.redirect("success.html");}
                    //redirect to main page, display "logged in as {username}"
                else{
                    res.redirect("failure.html");}
                    //tell user email/password is wrong -> redirect to another page/go back to the beginning
            }
        }
    
    });
      
  })
  .get('/logout', function (req, res) {
    delete req.session.user_id;
    console.log('user id: '+req.session.user_id)
    res.redirect('login.html');
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


//every time app.get a page, add the check Auth function (ex:

//app.get('/my_secret_page', checkAuth, function (req, res) {
  //res.send('if you are viewing this page it means you are logged in');
//});
