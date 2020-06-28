const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
                      });
const session = require('express-session');
const jsdom = require("jsdom");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  "808655872391-1modhjerhfk1elu3m2ctchmd7nv3uol3.apps.googleusercontent.com", // ClientID
  "fKuxmwQ-S5ccU1hswuENab2L", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: "1//04oiRrMshuSymCgYIARAAGAQSNwF-L9Irq1pOYb1adGXuXqqGTFRXZmULmvhJULhcEznqDSQdEZ4roNPXdtik-TKa4oSEhXpiggQ"
});
const accessToken = oauth2Client.getAccessToken()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'tonalddrump001@gmail.com',
    clientId: '808655872391-1modhjerhfk1elu3m2ctchmd7nv3uol3.apps.googleusercontent.com',
    clientSecret: 'fKuxmwQ-S5ccU1hswuENab2L',
    refreshToken: '1//04oiRrMshuSymCgYIARAAGAQSNwF-L9Irq1pOYb1adGXuXqqGTFRXZmULmvhJULhcEznqDSQdEZ4roNPXdtik-TKa4oSEhXpiggQ',
    accessToken: accessToken

  }
});



function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function makeconfcode(length) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    console.log('You are not authorized to view this page');
    res.redirect("login.html");
  }
  else {
    console.log("check auth success")
    return next();
  }
}

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret:"skiptheline"
    //user_id: ""
  }));
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next()
  })
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.redirect('login.html'));
app.get('/login', (req, res) => res.redirect('login.html'));

app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});

app.get('/signup', (req, res) => res.redirect('sign_up.html'));

app.post('/createaccount', (req, res) => {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  req.session.usr = req.body.usr;
  req.session.pwd = req.body.pwd;
  var confcode = makeconfcode(6);
  
  const mailOptions = {
    from: 'tonalddrump001@gmail.com', // sender address
    to: req.session.usr, // list of receivers
    subject: 'Skip The Line Confirmation Code', // Subject line
    html: `<p>Your confirmation code is: '${confcode}'</p>`// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });

  req.session.confcode = confcode;
  res.render("pages/confirmation_code.ejs");
});

app.post('/confirmation', (req, res) => {
  var codeconf = req.body.code;
  if (codeconf == req.session.confcode) {
    var usr = req.session.usr;
    var pwd = req.session.pwd;
    var createAccountQuery = `INSERT INTO users(username, password) SELECT '${usr}', crypt('${pwd}', gen_salt('bf')) WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = '${usr}');`;
    pool.query(createAccountQuery, (error, result) => {
      if (error) {
        res.send(error);
      }
      else {
        if (result.rowCount === 0) {
          console.log("account already exists");
          res.redirect("login.html");
        }
        else {
          res.render("pages/create_account_success.ejs");
        }
      }
        
    });
    //go to SQL table and change boolean to 1
  }
});


app.get('/users', async (req, res) => {
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
});

app.get('/orders', async (req, res) => {
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
});

app.get('/order_details', async (req, res) => {
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
});

app.get('/menu', async (req, res) => { //make admin checkAuth function and call it here
  try {
    const client = await pool.connect()
    const foodResult = await client.query('SELECT * FROM foodmenu;');
    const foodResults = { 'fRows': (foodResult) ? foodResult.rows : null};
    const drinkResult = await client.query('SELECT * FROM drinkmenu;');
    const drinkResults = { 'dRows': (drinkResult) ? drinkResult.rows : null};
    res.render('pages/menu.ejs', {row1: foodResults, row2: drinkResults} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/login',  (req, res) => {
  var loginUsername = req.body.username;
  var loginPassword = req.body.password;
  var loginQuery = `select * from users where users.username = '${loginUsername}' AND password = crypt('${loginPassword}', password)`;
  pool.query(loginQuery, (error, result) => {
    if (error)
      res.send(error);
    else {
      var results = {'rows': result.rows };
      if (results.rows === undefined || results.rows.length == 0){
        res.redirect("failure.html");
        //tell user email/password is wrong -> redirect to another page/go back to the beginning
      }
      else{
        //check password
        var databasepassword = results.rows[0].password;
        if (databasepassword === loginPassword){
          req.session.user_id = makeid(10);
          req.session.username = loginUsername;
          res.redirect("/order_now");
        }
        else{
          res.redirect("failure.html");
          //tell user email/password is wrong -> redirect to another page/go back to the beginning
        }
      }
    }
  })
});

app.get('/order_now', checkAuth, async (req, res) => {
  try {
    const client = await pool.connect()
    const foodResult = await client.query(`SELECT item,price FROM foodmenu;`);
    const drinkResult = await client.query(`SELECT item,price FROM drinkmenu;`);
    const foodResults = { 'fRows': (foodResult) ? foodResult.rows : null};
    const drinkResults = { 'dRows': (drinkResult) ? drinkResult.rows : null};
    res.render('pages/order_now.ejs', {row1: foodResults, row2: drinkResults} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
  
});

app.post('/date_select', async (req,res) => {

  
  
  try {
    var chosenDate = new Date(req.body.dates);
    chosenDate = chosenDate.toISOString();
    var dateObject = {'chosenDate': chosenDate};
    const client = await pool.connect()
    const foodResult = await client.query(`SELECT item,price FROM foodmenu WHERE '${chosenDate}' >= foodmenu.startdate AND '${chosenDate}' <= foodmenu.enddate;`);
    const drinkResult = await client.query(`SELECT item,price FROM drinkmenu;`);
    const foodResults = { 'fRows': (foodResult) ? foodResult.rows : null};
    const drinkResults = { 'dRows': (drinkResult) ? drinkResult.rows : null};
    res.render('pages/order_now.ejs', {row1: foodResults, row2: drinkResults, row3: dateObject} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/confirm_order', (req,res) => {

  var cart = JSON.parse(req.body.value);
  req.session.cart = cart;
  console.log("index.js cart = " + JSON.stringify(cart));
  res.render('pages/confirm_order.ejs', cart);
});

app.get('/confirm_order', (req,res) => {
  var cart = req.session.cart;
  console.log('app.get cart = ' + JSON.stringify(cart));
  res.render('pages/confirm_order.ejs', cart);
  delete req.session.cart;
  console.log("session cart = " + req.session.cart);
})

app.get('/pending_orders', checkAuth, function (req, res) {
  res.render('pages/pending_orders.ejs');
});
app.get('/order_history', checkAuth, function (req, res) {
  res.render('pages/order_history.ejs');
});

app.post('/menu_add', function (req, res) {
  var menuItemAdd = req.body.menuItemAdd;
  var menuItemPrice = req.body.menuItemPrice;
  var menuItemStartDate = new Date(req.body.menuItemStartDate);
  var menuItemEndDate = new Date(req.body.menuItemEndDate);
  menuItemStartDate = menuItemStartDate.toISOString();
  menuItemEndDate = menuItemEndDate.toISOString();

  console.log(menuItemStartDate);
  console.log(menuItemEndDate);

  var menuItemAddQuery = `INSERT INTO foodmenu SELECT '${menuItemAdd}', '${menuItemPrice}', '${menuItemStartDate}', '${menuItemEndDate}' WHERE NOT EXISTS(SELECT 1 FROM foodmenu WHERE item='${menuItemAdd}' AND startdate='${menuItemStartDate}' AND enddate='${menuItemEndDate}');`;
  console.log("Menu add item Query");
  pool.query(menuItemAddQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(result);
      
      // if (result.rowCount === 0) {
      //   var errorMessage = "Item already in the menu";
      //   res.render('pages/menu.ejs');
      // }
      // else {
      //   var errorMessage = "Item added";
      //   res.render('pages/menu.ejs');
      // }
      res.redirect('/menu');
    }
  });

  
});

app.post('/menu_remove', function (req, res) {
  var menuItemRemove = req.body.menuItemRemove; //temporary
  var menuDateRemove = req.body.menuDateRemove;
  var menuRemoveQuery = `DELETE FROM foodmenu WHERE item = '${menuItemRemove}' AND '${menuDateRemove}' >= startdate AND '${menuDateRemove}' <= enddate;`;
  pool.query(menuRemoveQuery, (error, result) => {
    if (error) {
      res.send(error);
    }
    else {
      res.redirect('/menu');
    }
  });
});


app.post('/logout', function (req, res) {
  delete req.session.user_id;
  console.log('user id: '+req.session.user_id)
  res.redirect('login.html');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
