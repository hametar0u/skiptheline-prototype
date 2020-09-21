const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
var pool;
var LOCAL_DEV_FLAG = false;
if (LOCAL_DEV_FLAG){
  pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'skiptheline',
    port: 5432
  });
}
else{
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
}

const session = require('express-session');
const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const { isNullOrUndefined } = require('util');
if (LOCAL_DEV_FLAG){
  const stripe = require("stripe")('sk_test_51G8FYDCBPdoEPo2u1Oyqie0LaQVXVSVhTvP0DckvF8P3WpKz2HVSzJeJrTD3dEwA9BHFT1OQRIEutDBn8qqhegio00H5t5Um5o');
  var options = {
    auth: {
      api_user: 'kevinlu1248@gmail.com',
      api_key: 'mrhob1ggay'
    } 
  }
}
else{
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  var options = {
    auth: {
      api_user: process.env.SENDGRIDUSER,
      api_key: process.env.SENDGRIDPASS
    }
  }
}

var transporter = nodemailer.createTransport(sgTransport(options));


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
  resave: true,
  saveUninitialized: false,
  secret:"skiptheline",
  cookie: {maxAge: 600000}
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
  
  var mailOptions = {
    from: 'kevinlu1248@gmail.com', // sender address
    to: req.session.usr, // list of receivers
    subject: 'Skip The Line Confirmation Code', // Subject line
    html: `<p>Your confirmation code is: '${confcode}'</p>`// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log('Message sent: ' + info);
  });

  req.session.confcode = confcode;
  res.render("pages/confirmation_code.ejs");
});

app.post('/confirmation', (req, res) => {
  var codeconf = req.body.code;
  if (codeconf == req.session.confcode) {
    var usr = req.session.usr;
    var pwd = req.session.pwd;
    var user_id = makeconfcode(7);
    var select_query = "SELECT id,username FROM users;"
    pool.query(select_query, (error, result) => {
      if(error) {
        res.send(error);
      }
      else {
        var id_array = [];
        var username_array = [];
        console.log(result[i]);
        for (var i = 0; i<result.rowCount; i++) {
          console.log(result.rows[i]);
          id_array.push(result.rows[i][0]);
          username_array.push(result.rows[i][1]);
        }
        while (user_id in id_array || user_id[0]==0) {
          user_id = makeconfcode(7);
        }
        while (usr in username_array) {
          console.log("account already exists");
          res.redirect("login.html");
        }
        console.log("confcode creation 200 OK");
      }
    });
    
    var createAccountQuery = `INSERT INTO users VALUES('${user_id}', '${usr}', crypt('${pwd}', gen_salt('bf')));`;
    pool.query(createAccountQuery, (error, result) => {

      if (error) {
        res.send(error);
      }
      else {
        res.render("pages/create_account_success.ejs");
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
    const result = await client.query('SELECT * FROM order_details WHERE ;');
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
    if (error){
      res.send(error);
    }
    else {
      var results = {'rows': result.rows };
      if (results.rows === undefined || results.rows.length == 0){
        res.redirect("failure.html");
        //tell user email/password is wrong -> redirect to another page/go back to the beginning
      }

      else{
        //check password
        req.session.user_id = makeid(10);
        req.session.username = loginUsername;
        console.log("login username - ", req.session.username)
        res.redirect("/order_now");
          //tell user email/password is wrong -> redirect to another page/go back to the beginning
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
    res.render('pages/order_now.ejs', {row3: dateObject, row1: foodResults, row2: drinkResults} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/confirm_order', (req,res) => {
  var cart_items = req.body.cart_items;
  req.session.cart = {
    "cart_items": req.body.cart_items,
    "item_amount": req.body.item_amount,
    "total_cost": req.body.total_cost
  };
  req.session.save();
  console.log("req.session.cart = ",JSON.stringify(req.session.cart));
});

app.get('/confirm_order_load', (req,res) => {
  //console.log("req.session.cart in app.get = " , req.session.cart);
  var cart = req.session.cart;
  var failCount = 0;
  while (isNullOrUndefined(cart){
    if (failCount > 20){
      break;
    }
    cart = req.session.cart;
    console.log(cart);
    failCount += 1;
  }
    
  console.log('cart = ' , cart);
  if (isNullOrUndefined(cart)){
    res.redirect('/order_now');
  }
  else{
    res.render('pages/confirm_order.ejs', cart);
  }
});

var calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};


app.post("/create-checkout-session", async (req, res) => {
  var cart = req.session.cart;
  var cart_items = cart.cart_items;
  var line_item_array = [];
  for (var i=0; i<cart.item_amount; i++) {
    line_item_array.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: cart_items[i].item,
        },
        unit_amount: cart_items[i].price*100,
      },
      quantity: cart_items[i].quantity,
    });
  }
  console.log(line_item_array);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_item_array,
    mode: "payment",
    success_url: "https://skipthelinebeta.herokuapp.com/order_success",
    cancel_url: "https://skipthelinebeta.herokuapp.com/order_now",
  });

  res.json({ id: session.id });
});

app.get('/order_success', (req,res) => {
  var username = req.session.username;
  var orderIDQuery = 'SELECT order_id FROM order_details;';
  var order_id = makeconfcode(7); //reusing code lmao
  pool.query(orderIDQuery, (error,result) => {
    if(error) {
      res.send(error);
    }
    else {
      while (order_id in result || order_id[0]==0) {
        order_id = makeconfcode(7);
      }
      console.log("confcode creation 200 OK");
    }
  });

  var str = "INSERT INTO order_details VALUES";
  for (var i=0; i<req.body.item_amount; i++) {
    str+=`('${order_id}','${cart_items[i].item}','${cart_items[i].price}','${cart_items[i].quantity}','${cart_items[i].date}'),`
  }
  str = str.slice(0,-1) + ';';
  //console.log('order detail query:',str);
  pool.query(str, (error,result) => {
    if(error) {
      console.log('/order_success error');
      res.send(error);
    }
    else {
      console.log('/order_success 200 OK');
    }
  });

  var userIdRetrieveQuery = `SELECT id FROM users WHERE "username" = '${username}';`;
  //console.log("retrieve ID query = ",userIdRetrieveQuery);
  pool.query(userIdRetrieveQuery, (error,result) => {
    if(error) {
      console.log('user id retrieve error');
      res.send(error);
    }
    else {
      console.log('user id retrieve 200 OK, result = ',result.rows[0].id);
      var orderJoinQuery = `INSERT INTO orders("users_id", "order_id", "complete") VALUES('${result.rows[0].id}','${order_id}','0');`;
      //console.log("order join query = ",orderJoinQuery);
      pool.query(orderJoinQuery, (error,result) => {
        if(error) {
          console.log('order join error = ',error);
          //res.send(error);
        }
        else {
          console.log('order join 200 OK');
        }
      });
    }
  });
  res.redirect('/order_success.html');
});


app.get('/pending_orders', checkAuth, function (req, res) {
  order_query = `SELECT user_id,order_id,date,item,price,quantity FROM order_details NATURAL JOIN orders NATURAL JOIN users WHERE orders.complete = '0' AND users.username = '${req.session.username}' ORDER BY date;`;
  pool.query(order_query, (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(result.rows);
      res.render('pages/pending_orders.ejs',result);
    }
  });
  
});



app.get('/order_history', checkAuth, function (req, res) {
  order_query = `SELECT user_id,order_id,date,item,price,quantity FROM order_details NATURAL JOIN orders NATURAL JOIN users WHERE orders.complete = '1' AND users.username = '${req.session.username}' ORDER BY date;`;
  pool.query(order_query, (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(result.rows);
      res.render('pages/order_history.ejs',result);
    }
  });
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

app.post('/drink_menu_add', function (req,res) {
  var menuItemAdd = req.body.drinkMenuItemAdd;
  var menuItemPrice = req.body.drinkMenuItemPrice;
  var menuItemAddQuery = `INSERT INTO drinkmenu SELECT '${menuItemAdd}', '${menuItemPrice}'  WHERE NOT EXISTS(SELECT 1 FROM drinkmenu WHERE item='${menuItemAdd}');`;
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
  req.session.destroy();
  res.redirect('login.html');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//commnet