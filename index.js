/*

Imgur client ID
45d3e08f6d057e0
Imgur client secret
ac7c89ce7c15000fd0a623723cfc3b52e48dc6fa

Immediate TO DO
// add next calendar at end of months

//go through all pages to see which ones still need styling
  DESKTOP
  - order now --> edit pwd div could use some work + absolutely fucked on pages that are not order now, settings logo alignment
  - login %
  - login fail %
  - date_select.ejs --> calendar alignment
  - confirm_order.ejs %
  - sign up.ejs --> labels instead of value, div width different from login
  - confirmation_code.ejs --> import bootstrap?
  - unauthorized.html --> vertical aligning (use top:0 bottom:0 shit), teal header instead of white
  - error.html -->  vertical aligning
  - order_history --> table and text above not aligned horizontally
  - pending orders --> table and text above not aligned horizontally
  - order_success_local --> vertical aligning, teal header instead of white
  - create_account_success.ejs --> white header instead of teal
  - edit_password.ejs --> width of form fields, confirm button, STL banner 
  - password change success --> vertical aligning, teal banner
  - forget password --> STL banner, an email has been sent to ___ wack
  - reset password --> stylesheet not connected for some reason
  - admin_dashboard.ejs --> navbar fucked
  - order management --> table not center aligned, complete order button spacing, perhaps add some instructions to make it clearer?
  - menu.ejs --> navbar fucked
  - emails --> I give up
  MOBILE
  - order now --> edit pwd too fat, cart heading + table off center
  - login --> bone gets pushed down for mobile S size, might actually look better without box bordering on the sides
  - date_select.ejs -->  calendar spacing wackkk
  - confirm_order.ejs --> table pushes out of the div, buttons look weird
  - nav.ejs --> bone too big, yikes on every page that's not order now
  - sign up.html --> box width different from login
  - sign up.ejs
  - confirmation_code.ejs --> STL banner not scaled properly, code box too narrow, submit button extra ugly, resend confirmation a ref cut off
  - unauthorized.html --> button + text too large
  - error.html --> same as desktop
  - order_history --> Might need a heading + table pushes out of page
  - pending orders --> Might need a heading + table pushes out of page
  - order_success_local.html --> text looks weird
  - create_account_success.ejs --> wack font size + white header??
  - edit_password.ejs --> same as desktop
  - password change success --> font size inconsistent with other similar pages
  - forget password --> consider taking out the borders on the sides, an email has been sent ___ similar problems as ddesktop ver.
  - reset password --> same as desktop
  - emails --> vertical alignment on logo

//start preparing the prod version
//database pages


//cors
//js import error cannot start react

Done
//fix email up -- somewhat
//various scaling and positioning issues


For next session 
// disable invert colors for dark mode

UI / cosmetics
// unable to align email divs to center
// gear icon aspect ratio wack + doesn't scale at all
// date select calendar formatting
// mobile menu position kinda jank and doesn't scale with screen size -- MEDIUM
// order success mobile scaling -- MEDIUM
//  order now (cart table kinda jank cuz adding hamburger pushes the table off the screen) -- MEDIUM
//  confirmation code -- LOW
//  admin dashboard -- LOW
// navbar mobile -- LOW
// calendar glowing select bootstrap style -- LOW
// order quantity on order now page: select? -- LOW
//better wipe transition -- https://www.youtube.com/watch?v=yoO0OGuEeHs -- doesn't have to be as bougie but
//make images more robust

IMPROVEMENTS:
// make the date format readable -- partially solved except pending orders/order history
//check if the db queries on the order now have already been run and if so just don't run it
// check if current password and new password is the same
// revert edit password changes if not owner

problems:
//gmail client screws up my class and id names which screws up CSS -- resolved through inline styling but even so things are still f'ed
//back to login in reset password goes to the 500 page
//stripe receipt email not sending through --  might be the test api key
//sometimes the pricelist cookie gets wiped and the app crashes when adding to cart
//the selected date is one more than the date actually selected -- stopped happening today what the f

Pending:
// GUI for uploading images
//change sendgrid to actual STL email
//Integrate React by refactoring the entire code
//random idea for security but we should log all the actions of admin and sudo accounts (ehem mihoyo)

image urls
https://cdn.discordapp.com/attachments/845815813865078824/846761425170202644/Chicken_Rice.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761429771091998/Chocolate_Milk.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761430820061254/Dasani_Water.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761432158437406/Fiji_Water.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761433161007124/Hamburger.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761434649722920/logo-teal.png
https://cdn.discordapp.com/attachments/845815813865078824/846761436159934494/logo.png
https://cdn.discordapp.com/attachments/845815813865078824/846761437565026384/menu_icon.png
https://cdn.discordapp.com/attachments/845815813865078824/846761438683987988/Orange_Juice.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761440413351986/Orange.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761489443323984/shopping-cart-icon-vector.png
https://cdn.discordapp.com/attachments/845815813865078824/846761497395724298/Smoothie.jpg
https://cdn.discordapp.com/attachments/845815813865078824/846761510088867880/Special.png
https://cdn.discordapp.com/attachments/845815813865078824/846761513921675294/Unknown.png
https://cdn.discordapp.com/attachments/845815813865078824/846762274399322122/settings_icon.png


menu page
- use input on menu already to rename imgs
- enforce jpg images
- input type file
- todo: how to designate destination file 


*/

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const PORT = process.env.PORT || 5000 
const { Pool } = require('pg');
var pool;
var LOCAL_DEV_FLAG = false;
var local_dev_object = {'LOCAL_DEV_FLAG': LOCAL_DEV_FLAG};

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

//const scripts = require('./scripts');
const session = require('express-session');
const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const { isNullOrUndefined } = require('util');
const fs = require('fs');
const { callbackPromise } = require('nodemailer/lib/shared'); 
const { appengine } = require('googleapis/build/src/apis/appengine');

var stripe;
if (LOCAL_DEV_FLAG){
  stripe = require("stripe")('sk_test_51G8FYDCBPdoEPo2u1Oyqie0LaQVXVSVhTvP0DckvF8P3WpKz2HVSzJeJrTD3dEwA9BHFT1OQRIEutDBn8qqhegio00H5t5Um5o');
  var options = {
    auth: {
      api_user: 'kevinlu1248@gmail.com',
      api_key: 'mrhob1ggay'
    } 
  }
}
else{
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
  var char = characters.charAt(Math.floor(Math.random() * charactersLength));
  while (char == '0') {
    char = characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += char;
  for ( var i = 1; i < length; i++ ) {
    char = characters.charAt(Math.floor(Math.random() * charactersLength)); 
    result += char;
  } 
  return result;
}

async function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    console.log('You are not authorized to view this page');
    res.render("pages/unauthorized.ejs");
  }
  else {
    console.log("check auth success")
    return next();
  }
}

function checkAdmin(req,res,next) { //for level 1
  var adminQuery = `SELECT authority FROM users WHERE username = '${req.session.username}';`;
  var results;
  var level = 0;
  pool.query(adminQuery, (error,result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      console.log("result.rows=",result.rows);
      if (result.rows.length == 0) {
        console.log("result.rows was empty");
        res.redirect("/");
      }
      else {
        results = {'rows': result.rows };
        level = results.rows[0].authority;
        console.log("level = ",level)
        if (level == 0) {
          console.log("you don't have level 1+ clearance");
          res.render("pages/unauthorized.ejs");
        }
        else {
          console.log("level 1+ clearance");
          return next();
        }
      }
    }
  });

}
function checkAdmin2(req,res,next) { //for level 2
  var adminQuery = `SELECT authority FROM users WHERE username = '${req.session.username}';`;
  var results;
  var level = 0;
  pool.query(adminQuery, (error,result) => {
    if (error) {
      return callback(error); //console log error and redirect to client error page
    }
    else {
      console.log("result.rows=",result.rows);
      if (result.rows.length == 0) {
        console.log("result.rows was empty");
        res.redirect("/");
      }
      else {
        results = {'rows': result.rows };
        level = results.rows[0].authority;
        console.log("level = ",level)
        if (level == 2) {
          console.log("level 2 clearance");
          return next();
        }
        else {
          console.log("you don't have level 2 clearance");
          res.render("pages/unauthorized.ejs");
        }
      }
    }
  });

}

//cart class
class Cart{
  //item_amount = 0;
  //total_price = 0;
  //items = [];
  
  constructor(){
    this.item_amount = 0;
    this.total_price = 0;
    this.items = [];          //item = {name, price, amount}
    this.pricelist = {};
  }

  getDBfoodprices(callback){
    var getpricequery = `SELECT item, price FROM foodmenu;`;
    pool.query(getpricequery, (error,result) => {
      if (error) {
        return callback(error);
      }
      else {
        var results = {'rows': result.rows };
        //console.log(results);
        callback(null, results);
      }
    });
  }
  getDBdrinkprices(callback){
    var getpricequery = `SELECT item, price FROM drinkmenu;`;
    pool.query(getpricequery, (error,result) => {
      if (error) {
        return callback(error);
      }
      else {
        var results = {'rows': result.rows };
        //console.log(results);
        callback(null, results);
      }
    });
  }

  insertPrice(item, price){
    this.pricelist[item] = price;
    if (this.pricelist[item] == price) {
      return 0;
    }
    else if (this.pricelist[item] != price) {
      this.pricelist[item] = price;
      return 0;
    }
    else {
      return -1;
    }
  }
  
  showPrice(){
    return this.pricelist;
  }

  updateAmountAndPrice(){
      var total = 0;
      var cart_items = this.items
      for (var i = 0; i < this.items.length; i++){
          total += (cart_items[i].price * cart_items[i].amount);
      }
      this.total_price = total;
      this.item_amount = this.items.length;
      return;
  }

  getItems(){
      return this.items;
  }

  loadItems(items){
      this.items = items;
      return;
  }

  hasItem(name){
      if (this.items === undefined){
          return -1;
      }

      for (var i = 0; i < this.items.length; i++){
          if (name == this.items[i].name){
              return i;
          }
      }
      return -1;
  }

  updateItem(item){
      var i = this.hasItem(item.name);
      this.items[i].amount += item.amount;
      return;
  }

  addItem(item){
      if (isNaN(item.amount) || item.amount == 0) {
        return;
      }

      if (this.hasItem(item.name) === -1){
          this.items.push({
              name: item.name,
              price: item.price,
              amount: item.amount,
              date: item.date
          });
          this.item_amount += 1;
      }
      else {
          this.updateItem(item);
      }
      this.updateAmountAndPrice();
      return;
  }

  removeItem(item_name){
    var i = this.hasItem(item_name);
    if (i != -1){
      this.items.splice(i,1);
    }
    return;
  }

  clearItems(){
      this.items = [];
      this.total = 0;
      this.item_amount = 0;
      return;
  }
};

var cart = new Cart();

// getDBfoodprices runs first
// cart.getDBfoodprices(function(err, result){
//   //=== code inside getDBfoodprices ===//
//   // var getpricequery = `SELECT item, price FROM foodmenu;`;
//   //   pool.query(getpricequery, (error,result) => {
//   //     if (error) {
//   //       return callback(error);
//   //     }
//   //     else {
//   //       var results = {'rows': result.rows };
//   //       //console.log(results);
//   //       callback(null, results);
//   //     }
//   // });
//   //query finishes, this runs third
//   for (var i = 0; i<result.rows.length; i++) {  
//     var list = cart.insertfoodprice(result.rows[i].item, result.rows[i].price)
//   }
//   //console.log(list)
// });

//this console.log runs second
//console.log(cart.showPrice())

var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public', express.static(path.join(__dirname, 'public')));


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

app.get('/', (req, res) => res.render('pages/login.ejs', local_dev_object));
app.get('/login', (req, res) => res.render('pages/login.ejs', local_dev_object));
app.get('/test', (req, res) => res.redirect('test_page.html'));

app.get('/my_secret_page', checkAdmin2, function (req, res) {
  res.send('if you are viewing this page it means the function works');
}); 

app.get('/signup', (req, res) => res.render('pages/sign_up.ejs', {account_exists:0, 'LOCAL_DEV_FLAG': LOCAL_DEV_FLAG}));
app.get('/createaccountsuccess', (req, res) => res.render('pages/create_account_success.ejs', local_dev_object)); //REMOVE IN PROD

app.post('/createaccount', (req, res) => {
  var usr = req.body.usr;
  console.log("usr = ", usr);
  var select_query = "SELECT username FROM users;"
  console.log ("start of pool query");
  req.session.account_exists = 0;
  pool.query(select_query, (error, result) => {
    if(error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      var username_array = [];
      for (var i = 0; i<result.rowCount; i++) {
        console.log(result.rows[i]);
        username_array.push(result.rows[i]['username']); 
        // console.log("result.rows[i]['user_id'] = ",result.rows[i]['user_id']);
        // console.log("result.rows[i]['username'] = ",result.rows[i]['username']);
      }
      console.log("username_array = ",username_array);
      for (var i=0; i<username_array.length; i++){
        if (usr == username_array[i]) {
          req.session.account_exists = 1;
        }
      }
      if (req.session.account_exists == 1) {
        console.log("account already exists");
        res.render('pages/sign_up.ejs', {'account_exists': req.session.account_exists});
      }
      else{
        req.session.usr = usr; 
        req.session.pwd = req.body.pwd;
        var confcode = makeconfcode(6);
        
        var mailOptions = {
          from: 'kevinlu1248@gmail.com', // sender address
          to: req.session.usr, // list of receivers
          subject: `${confcode} is your Skip The Line Confirmation Code`, // Subject line
          html: `
          <style>
              html {
                text-align:center;
                font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
              }
              p {
                color: black;
                font-size: 20px;
                text-align: center;
              }
              h1 {
                color: black;
                font-size: 40px; 
                font-weight: 500;
                text-align: center;
              }

              .header {
                /* padding-top: 2%;
                padding-bottom: 1%; */
                background-color: white; 
                width:  100%;
                top:    0;
                left:   0;
                margin: auto;
                font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
                background-color:#60D5DA;
                color:white;
                /* position:fixed;
              margin-bottom:20px; */
                text-align:center;
                padding-left: 3%;
                padding-right: 3%;
                display:inline-block;
                z-index: 69;
                margin-bottom: 30px;
              }
              .what {
                padding: 30px;
                background-color: rgb(240,240,240);
                width: 100%;
              }
              #logo {
                width: 100px;
                line-height: 100%;
              }
            </style>
            <div class="header" style=" 
            background-color: white;
            background-color: white; 
            width:  100%;
            top:    0;
            left:   0;
            margin: auto;
            font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
            background-color:#60D5DA;
            color:white;
            text-align:center;
            padding-left: 3%;
            padding-right: 3%;
            display:inline-block;
            z-index: 69;
            margin-bottom: 30px;">
              <img id="logo" src="cid:logo" style="width: 100px;">
              <h1 style="color: #60D5DA; text-align:center; display:inline-block; margin-block-start:0em; margin-block-end: 0em; font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif; font-weight: 500;">SKIP THE LINE</h1>
            </div>
            <div class="what" style="
            padding: 30px;
            background-color: rgb(240,240,240);">
              <p style="
              font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
              color: black;
              font-size: 20px;
              text-align: center;">
                Your confirmation code is:<br>
              </p>
              <h1 style="
              color: black;
              font-size: 40px; 
              font-weight: 500;
              text-align: center;">
                ${confcode}
              </h1>
              <p style="
              font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
              color: black;
              font-size: 20px;
              text-align: center;">
                Please paste this code onto the website to complete your registration.
              </p>
              <br>
            </div>
          `,// plain text body
          attachments: [
            {
              filename:'logo-teal.png',
              path:'https://cdn.discordapp.com/attachments/845815813865078824/846761434649722920/logo-teal.png',
              cid: 'logo'
            }
          ]
        };
      
        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log(err)
          else
            console.log('Message sent: ' + info);
        });
      
        req.session.confcode = confcode;
        res.render("pages/confirmation_code.ejs", {"confirmed": true});
      }
    }
  });
  
  // var firstname = req.body.firstname;
  // var lastname = req.body.lastname;
});

app.post('/resend_confirmation', (req, res) => {
  var usr = req.session.usr;
  req.session.usr = usr; 
  req.session.pwd = req.body.pwd;
  var confcode = makeconfcode(6);
  
  var mailOptions = {
    from: 'kevinlu1248@gmail.com', // sender address
    to: req.session.usr, // list of receivers
    subject: `${confcode}' is your Skip The Line Confirmation Code`, // Subject line
    html: `
    <style>
        html {
          text-align:center;
          font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
        }
        p {
          color: black;
          font-size: 20px;
          text-align: center;
        }
        h1 {
          color: black;
          font-size: 40px; 
          font-weight: 500;
          text-align: center;
        }

        .header {
          /* padding-top: 2%;
          padding-bottom: 1%; */
          background-color: white; 
          width:  100%;
          top:    0;
          left:   0;
          margin: auto;
          font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
          background-color:#60D5DA;
          color:white;
          /* position:fixed;
        margin-bottom:20px; */
          text-align:center;
          padding-left: 3%;
          padding-right: 3%;
          display:inline-block;
          z-index: 69;
          margin-bottom: 30px;
        }
        .what {
          padding: 30px;
          background-color: rgb(240,240,240);
          width: 100%;
        }
        #logo {
          width: 100px;
          line-height: 100%;
        }
      </style>
      <div class="header" style=" 
      background-color: white;
      background-color: white; 
      width:  100%;
      top:    0;
      left:   0;
      margin: auto;
      font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
      background-color:#60D5DA;
      color:white;
      text-align:center;
      padding-left: 3%;
      padding-right: 3%;
      display:inline-block;
      z-index: 69;
      margin-bottom: 30px;">
        <img id="logo" src="cid:logo" style="width: 100px;">
        <h1 style="color: #60D5DA; text-align:center; display:inline-block; margin-block-start:0em; margin-block-end: 0em; font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif; font-weight: 500;">SKIP THE LINE</h1>
      </div>
      <div class="what" style="
      padding: 30px;
      background-color: rgb(240,240,240);">
        <p style="
        font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
        color: black;
        font-size: 20px;
        text-align: center;">
          Your confirmation code is:<br>
        </p>
        <h1 style="
        color: black;
        font-size: 40px; 
        font-weight: 500;
        text-align: center;">
          ${confcode}
        </h1>
        <p style="
        font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
        color: black;
        font-size: 20px;
        text-align: center;">
          Please paste this code onto the website to complete your registration.
        </p>
        <br>
      </div>
    `,// plain text body
    attachments: [
      {
        filename:'logo-teal.png',
        path:'https://cdn.discordapp.com/attachments/845815813865078824/846761434649722920/logo-teal.png',
        cid: 'logo'
      }
    ]
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log('Message sent: ' + info);
  });

  req.session.confcode = confcode;
  res.render("pages/confirmation_code.ejs", {"confirmed": true});
});

app.post('/confirmation', (req, res) => {
  var codeconf = req.body.code;
  if (codeconf == req.session.confcode) {
    var usr = req.session.usr;
    var pwd = req.session.pwd;
    var user_id = makeconfcode(7);
    var select_query = "SELECT user_id,username FROM users;"
    console.log ("start of pool query");
    pool.query(select_query, (error, result) => {
      if(error) {
        console.log(error);
        res.redirect("/error");
      }
      else {
        var id_array = [];
        var username_array = [];
        console.log(result[i]);
        for (var i = 0; i<result.rowCount; i++) {
          console.log(result.rows[i]);
          id_array.push(result.rows[i]['user_id']);
          username_array.push(result.rows[i]['username']); 
          console.log("result.rows[i]['user_id'] = ",result.rows[i]['user_id']);
          console.log("result.rows[i]['username'] = ",result.rows[i]['username']);
        }
          console.log("id_array = ",id_array);
          console.log("username_array = ",username_array);
        while (usr in username_array) {
          console.log("account already exists");
          res.redirect("/");
        }
        while (user_id in id_array || user_id[0]==0) {
          user_id = makeconfcode(7);
        }
        console.log("confcode creation 200 OK");
      }
    });
    console.log("pool query complete");
    
    var createAccountQuery = `INSERT INTO users(user_id, username, password, authority) VALUES('${user_id}', '${usr}', crypt('${pwd}', gen_salt('bf')), '0');`;
    pool.query(createAccountQuery, (error, result) => {

      if (error) {
        console.log(error);
        res.redirect("/error");
      }
      else {
        res.render("pages/create_account_success.ejs", {'LOCAL_DEV_FLAG': LOCAL_DEV_FLAG});
      }
        
    });
    console.log("create account query complete");
    //go to SQL table and change boolean to 1
  }
  else {
    res.render("pages/confirmation_code.ejs", {"confirmed": false});
  }
});


app.get('/users', checkAdmin2, async (req, res) => { //change the EJS and query strings
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM users');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/users', results );
    client.release();
  } catch (err) {
    console.error(err);
    console.log(error);
    res.redirect("/error");
  }
});

app.get('/orders', checkAdmin2, async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM orders');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/orders', results );
    client.release();
  } catch (err) {
    console.error(err);
    console.log(error);
    res.redirect("/error");
  }
});

app.get('/order_details', checkAdmin2, async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM order_details WHERE ;');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/order_details', results );
    client.release();
  } catch (err) {
    console.error(err);
    console.log(error);
    res.redirect("/error");
  }
});

app.get('/menu', checkAdmin2, async (req, res) => { //make admin checkAuth function and call it here
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
    console.log(error);
    res.redirect("/error");
  }
});

app.get('/failure', (req, res) => res.render('pages/failure.ejs'));

app.post('/login',  (req, res) => {
  var loginUsername = req.body.username;
  if (loginUsername == "sudoUser") { //remove in prod
    console.log("sudo user remove in prod");
    req.session.user_id = makeid(10);
    req.session.username = loginUsername;
    res.redirect("/admin_dashboard")
    return;
  }
  else if (loginUsername == "cafAdmin") { //remove
    console.log("caf admin account remove in prod");
    req.session.user_id = makeid(10);
    req.session.username = loginUsername;
    res.redirect("/date_select")
    return;
  }

  var loginPassword = req.body.password;
  var loginQuery = `select * from users where users.username = '${loginUsername}' AND password = crypt('${loginPassword}', password)`;
  pool.query(loginQuery, (error, result) => {
    if (error){
      console.log(error);
      res.redirect("/error");
    }
    else {
      var results = {'rows': result.rows };
      if (results.rows === undefined || results.rows.length == 0){
        res.redirect("/failure");
        //tell user email/password is wrong -> redirect to another page/go back to the beginning
      }

      else{
        //check password
        req.session.user_id = makeid(10);
        req.session.username = loginUsername;
        console.log("login username - ", req.session.username)
        res.redirect("/date_select");
      } 
    }
  })
}); 

app.get('/edit_password', (req,res) => {
  res.render('pages/edit_password.ejs', {'pwd_correct': 1});
});

app.post('/edit_password', checkAuth, (req,res) => {
  var opwd = req.body.opwd;
  var pwd = req.body.pwd;
  console.log("opwd= ", opwd);
  console.log("req.session.username= ", req.session.username); //req.session.usr undefined for whatever reason
  var pwdConfirmQuery = `SELECT * FROM users WHERE users.username = '${req.session.username}' AND password = crypt('${opwd}', password)`;
  req.session.pwd_correct = 0;
  pool.query(pwdConfirmQuery, (error, result) => {
    if(error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      var pwd_array = [];
      for (var i = 0; i<result.rowCount; i++) {
        console.log(result.rows[i]);
        pwd_array.push(result.rows[i]['password']); 
        console.log("result.rows[i]['password'] = ",result.rows[i]['password']); //these aren't printing
      }
      console.log("pwd_array = ",pwd_array);
      for (var i=0; i<pwd_array.length; i++) {
        if (pwd_array[i]) {
          req.session.pwd_correct = 1;
        }
      }
      if (req.session.pwd_correct != 1) {
        console.log("passwords don't match!");
        res.render('pages/edit_password.ejs', {'pwd_correct': req.session.pwd_correct});
      }
      else{
        var resetpwdlink = makeid(24);
        req.session.resetpwdlink = resetpwdlink;

        var mailOptions = {
          from: 'kevinlu1248@gmail.com', // sender address //wait can we just change this
          to: req.session.username, // list of receivers
          subject: 'Skip The Line Edit Password Alert', // Subject line
          html: `
          <style>
          html {
            text-align:center;
            font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
          }
          p {
            color: black;
            font-size: 20px;
            text-align: center;
          }
          h1 {
            color: black;
            font-size: 40px; 
            font-weight: 500;
            text-align: center;
          }

          .header {
            /* padding-top: 2%;
            padding-bottom: 1%; */
            background-color: white; 
            width:  100%;
            top:    0;
            left:   0;
            margin: auto;
            font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
            background-color:#60D5DA;
            color:white;
            /* position:fixed;
          margin-bottom:20px; */
            text-align:center;
            padding-left: 3%;
            padding-right: 3%;
            display:inline-block;
            z-index: 69;
            margin-bottom: 30px;
          }
          .what {
            padding: 30px;
            background-color: rgb(240,240,240);
            width: 100%;
          }
          #logo {
            width: 100px;
            line-height: 100%;
          }
        </style>
        <div class="header" style=" 
        background-color: white;
        background-color: white; 
        width:  100%;
        top:    0;
        left:   0;
        margin: auto;
        font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
        background-color:#60D5DA;
        color:white;
        text-align:center;
        padding-left: 3%;
        padding-right: 3%;
        display:inline-block;
        z-index: 69;
        position: relative;
        margin-bottom: 30px;">
          <img id="logo" src="cid:logo" style="width: 100px; position: absolute; top: 0; bottom: 0; margin: auto;">
          <h1 style="color: #60D5DA; text-align:center; display:inline-block; margin-block-start:0em; margin-block-end: 0em; font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif; font-weight: 500;">SKIP THE LINE</h1>
        </div>
        <div class="what" style="
        padding: 30px;
        background-color: rgb(240,240,240);">
          <p style="
          font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
          color: black;
          font-size: 20px;
          text-align: center;">
          Your password has recently been changed. If this is not you, please click the button below to reset your password immediately.
          </p>
          <br>
          <div>
            <a href="http://localhost:5000/reset_password/${resetpwdlink}">
              <button style="background: none;
              color: rgb(94, 94, 94);
              border-radius: 1px;
              width: 200px;
              border: 2px solid rgb(94,94,94);
              display: inline-block;
              transition: 0.1s;
              padding:10px;
              border-radius: 0.4em;
              font-size: 16px;">
                Reset Your Password
              </button>
            </a>
          </div>
        </div>
        `,// plain text body
        attachments: [
          {
            filename:'logo-teal.png',
            path:'https://cdn.discordapp.com/attachments/845815813865078824/846761434649722920/logo-teal.png',
            cid: 'logo'
          }
        ]
        };
      
        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log(err)
          else
            console.log('Message sent: ' + info);
        });

        var changePwdQuery = `UPDATE users SET password = crypt('${pwd}', gen_salt('bf')) WHERE users.username = '${req.session.username}';`;
        pool.query(changePwdQuery, (error, result) => {
          if(error) {
            console.log(error);
            res.redirect("/error");
          }
          else {
            res.redirect("/password_change_success");
          }
        });

      }
    }
  });
});

//app.get('/resetPassword', (req, res) => { res.render("pages/reset_password.ejs");});

app.get('/forgot_password', (req, res) => {
  res.render('pages/forgot_password.ejs', {'messageStatus': 0});
});

app.post('/forgot_password', (req, res) => {
  var usr = req.body.username;
  var messageStatus = 0;
  var userIDretrievequery = `SELECT * FROM users where username = '${usr}';`;
  pool.query(userIDretrievequery, (error, result) => {
    if(error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      console.log("result.rows - ", result.rows);
      if ( result.rows.length == 0) {
        console.log('user does not match');
        console.log('messageStatus - ', messageStatus);
        messageStatus = 1;
        res.render('pages/forgot_password.ejs', {'messageStatus': messageStatus});
      }
      else {
        var resetpwdlink = makeid(24);
        req.session.resetpwdlink = resetpwdlink;
        console.log('req.session.resetpwdlink = ', req.session.resetpwdlink);

        var mailOptions = {
          from: 'kevinlu1248@gmail.com', // sender address //wait can we just change this
          to: usr, // list of receivers
          subject: 'Skip The Line Reset Password Link', // Subject line
          html: `
            <style>
              html {
                text-align:center;
                font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
              }
              p {
                color: black;
                font-size: 20px;
                text-align: center;
              }
              h1 {
                color: black;
                font-size: 40px; 
                font-weight: 500;
                text-align: center;
              }

              .header {
                /* padding-top: 2%;
                padding-bottom: 1%; */
                background-color: white; 
                width:  100%;
                top:    0;
                left:   0;
                margin: auto;
                font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
                background-color:#60D5DA;
                color:white;
                /* position:fixed;
              margin-bottom:20px; */
                text-align:center;
                padding-left: 3%;
                padding-right: 3%;
                display:inline-block;
                z-index: 69;
                margin-bottom: 30px;
              }
              .what {
                padding: 30px;
                background-color: rgb(240,240,240);
                width: 100%;
              }
              #logo {
                width: 100px;
                line-height: 100%;
              }
            </style>
            <div class="header" style=" 
            background-color: white;
            background-color: white; 
            width:  100%;
            top:    0;
            left:   0;
            margin: auto;
            font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
            background-color:#60D5DA;
            color:white;
            text-align:center;
            padding-left: 3%;
            padding-right: 3%;
            display:inline-block;
            z-index: 69;
            margin-bottom: 30px;
            position: relative;">
              <img id="logo" src="cid:logo" style="width: 100px; position; absolute; top: 0; bottom: 0; margin: auto;">
              <h1 style="color: #60D5DA; text-align:center; display:inline-block; margin-block-start:0em; margin-block-end: 0em; font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif; font-weight: 500;">SKIP THE LINE</h1>
            </div>
            <div class="what" style="
            padding: 30px;
            background-color: rgb(240,240,240);">
              <p style="
              font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
              color: black;
              font-size: 20px;
              text-align: center;">
                Please click the button below to reset your password immediately.
              </p>
              <br>
              <div>
                <a href="http://localhost:5000/reset_password/${resetpwdlink}">
                  <button style="background: none;
                  color: rgb(94, 94, 94);
                  border-radius: 1px;
                  width: 200px;
                  border: 2px solid rgb(94,94,94);
                  display: inline-block;
                  transition: 0.1s;
                  padding:10px;
                  border-radius: 0.4em;
                  font-size: 16px;">
                    Reset Your Password
                  </button>
                </a>
              </div>
            </div>
            
          `,// plain text body
          attachments: [
            {
              filename:'logo-teal.png',
              path:'https://cdn.discordapp.com/attachments/845815813865078824/846761434649722920/logo-teal.png',
              cid: 'logo'
            }
          ]
        }
      
        transporter.sendMail(mailOptions, function (err, info) {
          if(err) {
            console.log(err)
            res.redirect('/error');
          }
          else {
            console.log('Message sent: ' + info); 
            messageStatus = 2;
            req.session.resetPwdUsr = usr;
            console.log('messageStatus - ', messageStatus);
            res.render('pages/forgot_password.ejs', {'messageStatus': messageStatus, 'email': usr});
            messageStatus = 0;
          }
        });
      }
    }
  });
});

//provide email address to send link
//if email is in db then generate link and send the email
//else alert and point towards sign up

app.get('/reset_password/:resetpwdlink', (req, res) => {
  //console.log('req.params = ', req.params, '--- req.session.resetpwdlink = ', req.session.resetpwdlink);
  if (req.params.resetpwdlink == req.session.resetpwdlink) {
    res.render('pages/reset_password.ejs');
  }
  else {
    console.log(req.params.resetpwdlink, req.session.resetpwdlink);
    res.redirect('/error');
  }
});

// app.get('/reset_password', (req, res) => {
//   res.render('pages/reset_password.ejs');
// });

app.post('/reset_password', (req, res) => {
  var pwd = req.body.pwd;
  var usr = req.session.resetPwdUsr;

  var mailOptions = {
    from: 'kevinlu1248@gmail.com', // sender address //wait can we just change this
    to: usr, // list of receivers
    subject: 'Skip The Line Reset Password Confirmation', // Subject line
    html: `
    <style>
      html {
        text-align:center;
        font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
      }
      p {
        color: black;
        font-size: 20px;
        text-align: center;
      }
      h1 {
        color: black;
        font-size: 40px; 
        font-weight: 500;
        text-align: center;
      }

      .header {
        /* padding-top: 2%;
        padding-bottom: 1%; */
        background-color: white; 
        width:  100%;
        top:    0;
        left:   0;
        margin: auto;
        font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
        background-color:#60D5DA;
        color:white;
        /* position:fixed;
      margin-bottom:20px; */
        text-align:center;
        padding-left: 3%;
        padding-right: 3%;
        display:inline-block;
        z-index: 69;
        margin-bottom: 30px;
      }
      .what {
        padding: 30px;
        background-color: rgb(240,240,240);
        width: 100%;
      }
      #logo {
        width: 100px;
        line-height: 100%;
      }
    </style>
    <div class="header" style=" 
    background-color: white;
    background-color: white; 
    width:  100%;
    top:    0;
    left:   0;
    margin: auto;
    font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
    background-color:#60D5DA;
    color:white;
    text-align:center;
    padding-left: 3%;
    padding-right: 3%;
    display:inline-block;
    z-index: 69;
    margin-bottom: 30px;">
      <img id="logo" src="cid:logo" style="width: 100px;">
      <h1 style="color: #60D5DA; text-align:center; display:inline-block; margin-block-start:0em; margin-block-end: 0em; font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif; font-weight: 500;">SKIP THE LINE</h1>
    </div>
    <div class="what" style="
    padding: 30px;
    background-color: rgb(240,240,240);">
      <p style="
      font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
      color: black;
      font-size: 20px;
      text-align: center;">
        Your password has successfully been changed. Click the button below to login.
      </p>
      <br>
      <div>
        <a href="http://localhost:5000/">
          <button style="background: none;
          color: rgb(94, 94, 94);
          border-radius: 1px;
          width: 200px;
          border: 2px solid rgb(94,94,94);
          display: inline-block;
          transition: 0.1s;
          padding:10px;
          border-radius: 0.4em;
          font-size: 16px;">
            Reset Your Password
          </button>
        </a>
      </div>
    </div>      
  `,// plain text body
  attachments: [
    {
      filename:'logo-teal.png',
      path:'https://cdn.discordapp.com/attachments/845815813865078824/846761434649722920/logo-teal.png',
      cid: 'logo'
    }
  ]
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log('Message sent: ' + info);
  });

  var changePwdQuery = `UPDATE users SET password = crypt('${pwd}', gen_salt('bf')) WHERE users.username = '${usr}';`;
  pool.query(changePwdQuery, (error, result) => {
    if(error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      res.redirect("/password_change_success");
    }
  });
});

app.get('/password_change_success', (req, res) => {
  res.render('pages/password_change_success.ejs', {'LOCAL_DEV_FLAG': LOCAL_DEV_FLAG});
});

app.get('/admin_dashboard', checkAdmin, (req, res) => {res.render("pages/admin_dashboard.ejs");});

app.get('/order_now', checkAuth, async (req, res) => {
  var chosenDate = req.session.chosenDate;
  var dateObject = {'chosenDate': chosenDate};
    
  try {
    const client = await pool.connect()
    const foodResult = await client.query(`SELECT item,price FROM foodmenu WHERE '${chosenDate}' >= foodmenu.startdate AND '${chosenDate}' <= foodmenu.enddate;`);
    const drinkResult = await client.query(`SELECT item,price FROM drinkmenu;`);
    const foodResults = { 'fRows': (foodResult) ? foodResult.rows : null};
    const drinkResults = { 'dRows': (drinkResult) ? drinkResult.rows : null};
    const cart = { 'cartrow': req.session.cart };
    console.log("cart in date select post = ", cart);
    res.render('pages/order_now.ejs', {row3: dateObject, row1: foodResults, row2: drinkResults, row4: cart, page: 'order_now'} );
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.redirect("/error");
  } 
  
}); 
 
app.get('/date_select', (req,res) => {
  function select_date() {
    var count = 0; 
    var today = new Date;
    var array = []; 

    while (count<7) {
      today.setDate(today.getDate() + 1); 
      //console.log("today = ", today);
      if (today.getDay() != 0 && today.getDay() != 6) {// Skip weekends
        array.push(new Date(today)); 
        count++;
        //console.log("array = ", array);
      }
    }
    //console.log("array = ", array);
    return array;
  }
  var date_array = select_date();
  console.log("date_array= ", date_array); 

  var order_date_array = [];
  var order_date_array_object = [];
  //console.log("array_object = ", array_object); 

  //get dates for which user has already order for; combine if ordering into same date
  dateOrderQuery = `SELECT date, order_id FROM order_details NATURAL JOIN orders NATURAL JOIN users WHERE users.username = '${req.session.username}' GROUP BY date, order_id;`;
  pool.query(dateOrderQuery, (error, result) => {
    if (error){
      console.log(error);
      res.redirect("/error");
    }
    else {
      result.rows.forEach((i) => {
        order_date_array_object.push({'date': i.date, 'order_id': i.order_id});
        order_date_array.push(i.date);
      });
      
      req.session.ordered_date_array_object = order_date_array_object;
      console.log("order_date_array= ", order_date_array);
      console.log("order_date_array_object= ", order_date_array_object);
      res.render("pages/date_select.ejs", {'row1': date_array, 'row2': order_date_array});
    }
  });
});

app.post('/date_select', async (req,res) => { 
  //pricelist stuff
  if (req.session.pricelist == undefined) {
    req.session.pricelist = [];
  }
  cart.getDBfoodprices(function(err, result){
    for (var i = 0; i<result.rows.length; i++) {  
      var insertPriceCheck = cart.insertPrice(result.rows[i].item, result.rows[i].price);
      // only update pricelist if the menu updates to reduece overhang
      console.log('insertPriceCheck in food = ', insertPriceCheck);
    }
    var list = cart.showPrice();
    req.session.pricelist = list;
  }); 
  cart.getDBdrinkprices(function(err, result){
    for (var i = 0; i<result.rows.length; i++) {   
      var insertPriceCheck = cart.insertPrice(result.rows[i].item, result.rows[i].price);
      // only update pricelist if the menu updates to reduece overhang
      console.log('insertPriceCheck in drink = ', insertPriceCheck);
    }
    var list = cart.showPrice();
    req.session.pricelist = list;
  });
  console.log("req.session.pricelist = ", req.session.pricelist);
  console.log("line 522 session cart ",req.session.cart);
  //date stuff
  var chosenDate = new Date(req.body.calendarSelection);
  // if (req.body.isDesktop == 0) {
  //   chosenDate = new Date(req.body.selectDate);
  // }
  // else {
  //   chosenDate = new Date(req.body.calendarSelection);
  // }req.body.isDesktop
  console.log("isDesktop: ", req.body.isDesktop);
  console.log("selectdate: ", req.body.selectDate);
  console.log("calendar selection: ", req.body.calendarSelection);
  chosenDate = chosenDate.toISOString();
  var dateObject = {'chosenDate': chosenDate};
  console.log(dateObject);


  if (req.session.chosenDate != chosenDate) {
    cart.clearItems();
    req.session.cart = cart.getItems();
    req.session.chosenDate = chosenDate;
  }
    
  try {
    const client = await pool.connect()
    const foodResult = await client.query(`SELECT item,price FROM foodmenu WHERE '${chosenDate}' >= foodmenu.startdate AND '${chosenDate}' <= foodmenu.enddate;`);
    const drinkResult = await client.query(`SELECT item,price FROM drinkmenu;`);
    const foodResults = { 'fRows': (foodResult) ? foodResult.rows : null};
    const drinkResults = { 'dRows': (drinkResult) ? drinkResult.rows : null};
    const cartObject = { 'cartrow': req.session.cart };
    console.log("cart in date select post = ", cart);
    res.render('pages/order_now.ejs', {row3: dateObject, row1: foodResults, row2: drinkResults, row4: cartObject, page: 'order_now'} );
    client.release();
  } 
  catch (err) {
    console.log(error);
    res.redirect("/error");
  }
});

app.post('/add_to_cart', (req,res) => {
  var item_name = req.body.item_name;
  var item_quantity = (parseInt(req.body.item_quantity));
  console.log(req.session.pricelist);
  var item_price = req.session.pricelist[`${item_name}`];
  var item_date = req.session.chosenDate;

  console.log("item_price = ", item_price); 
  console.log("item_name = ",item_name);
  console.log("item_quantity = ",item_quantity);
  console.log("item_date = ",item_date);

  var item_object = {'name': item_name, 'price': item_price, 'amount': item_quantity, 'date': item_date};
  console.log('item object = ', item_object);
  cart.addItem(item_object);
  req.session.cart = cart.getItems();
  res.redirect("/order_now");
});
 
app.post('/remove_from_cart', (req,res) => {
  var item_name = req.body.item_name;
  //console.log('item_name = ', item_name);
  cart.removeItem(item_name);
  req.session.cart = cart.getItems();
  res.redirect('/order_now');
});

app.post('/remove_all_from_cart', (req,res) => {
  cart.clearItems();
  req.session.cart = cart.getItems();
  res.redirect('/order_now');
});

app.get('/confirm_order', (req,res) => {
  var cart_contents = req.session.cart; 
  var subtotal = 0;
  var chosenDate = req.session.chosenDate;
  if (cart_contents!= undefined) {
    for (var i=0; i<cart_contents.length; i++) {
      subtotal += cart_contents[i].price*cart_contents[i].amount;
    }
    subtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100
    console.log('subtotal = ', subtotal);
    res.render("pages/confirm_order.ejs", {'cart': cart_contents,'subtotal': subtotal, 'date': chosenDate});
  }
  else {
    console.log("cart_contents was undefined");
    res.redirect("/error");
  }
}); 


var calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
}; //is this obsolete?

app.post("/create-checkout-session", async (req, res) => {
  var cart_contents = req.session.cart; 
  var line_item_array = [];
  for (var i=0; i<cart_contents.length; i++) {
    line_item_array.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: cart_contents[i].name,
        },
        unit_amount: cart_contents[i].price*100,
      },
      quantity: cart_contents[i].amount,
    });
  }
  console.log(line_item_array);
  
  var success_url = "https://skipthelinebeta.herokuapp.com/order_success";
  var cancel_url = "https://skipthelinebeta.herokuapp.com/date_select";

  if (LOCAL_DEV_FLAG) {
    success_url = "http://localhost:5000/order_success";
    cancel_url = "http://localhost:5000/date_select";
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_item_array,
    mode: "payment",
    success_url: success_url,
    cancel_url: cancel_url,
    customer_email: req.session.username
  });

  res.json({ id: session.id });
});

//https://stripe.com/docs/testing for card information

app.get('/order_success', async (req,res) => { //bugged sometimes; result.rows undefined
  var user_id,order_id;
  var username = req.session.username;
  var cart_contents = req.session.cart
  console.log("req session cart 869= ", cart_contents);

  var order_id = makeconfcode(7);

  var orderIdRetrieveQuery = "SELECT order_id from order_details;";
  pool.query(orderIdRetrieveQuery, (err,res) => {
    if(err) {
      console.log('user id retrieve error = ',err);
      console.log(err);
      res.redirect("/error");
    }
    else {
      console.log('res.rows line 972 = ', res.rows);
      while (order_id in res.rows || order_id[0] == 0) {
        order_id = makeconfcode(7);
      }
    }
  });

  var userIdRetrieveQuery = `SELECT user_id FROM users WHERE "username" = '${username}';`;
  //console.log("retrieve ID query = ",userIdRetrieveQuery);
  pool.query(userIdRetrieveQuery, (err,result) => {
    if(err) {
      console.log('user id retrieve error = ',err);
      console.log(err);
      res.redirect("/error");
    }
    else {
      console.log('user id retrieve 200 OK, result = ',result.rows);
      user_id = result.rows[0].user_id
      
      var orderDatabaseQuery = "INSERT INTO order_details VALUES";
      var selectedDate = req.session.chosenDate.slice(0,10);
      console.log("rawOrderedDates= ", selectedDate);
      console.log("req session cart 891= ", cart_contents);
      cart_contents.forEach(cart_element => {
        orderDatabaseQuery+=`('${order_id}','${cart_element.name}','${cart_element.price}','${cart_element.amount}','${cart_element.date}'),`
      });
      orderDatabaseQuery = orderDatabaseQuery.slice(0,-1) + ';';
      console.log('orderDatabaseQuery= ', orderDatabaseQuery);
      pool.query(orderDatabaseQuery, (err,res) => {
        if(err) {
          console.log('/order_success error');
          console.log(err)
          res.redirect("/error");
        }
        else {
          console.log('/order_success 200 OK');
        }
      });
        
      var orderJoinQuery = `INSERT INTO orders("user_id", "order_id", "complete") VALUES('${user_id}','${order_id}','0');`;
      console.log("order join query = ",orderJoinQuery);
      pool.query(orderJoinQuery, (err,res) => {
        if(err) {
          console.log('order join error = ',err);
          console.log(err);
          res.redirect("/error");
        }
        else {
          console.log('order join 200 OK');
        }
      });
     
      console.log("userIDretrievequery complete");
      cart.clearItems(); //clear cart on order success
      req.session.cart = cart.getItems(); 
      

      res.render('pages/order_success.ejs', {'LOCAL_DEV_FLAG':LOCAL_DEV_FLAG});

    }
  });
});


app.get('/pending_orders', checkAuth, function (req, res) {
  order_query = `SELECT user_id,order_id,date,item,price,quantity FROM order_details NATURAL JOIN orders NATURAL JOIN users WHERE orders.complete = '0' AND users.username = '${req.session.username}' ORDER BY date;`;
  pool.query(order_query, (error, result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      console.log("result.rows = ",result.rows);
      res.render('pages/pending_orders.ejs',{result: result, page: 'pending_orders'});
    }
  });
  
});



app.get('/order_history', checkAuth, function (req, res) {
  order_query = `SELECT user_id,order_id,date,item,price,quantity FROM order_details NATURAL JOIN orders NATURAL JOIN users WHERE orders.complete = '1' AND users.username = '${req.session.username}' ORDER BY date;`;
  pool.query(order_query, (error, result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      console.log(result.rows);
      res.render('pages/order_history.ejs',{'result': result, page: 'order_history'});
    }
  });
});

app.get('/order_management', checkAdmin, function (req, res) {
  order_query = `SELECT user_id,order_id,date,item,price,quantity FROM orders NATURAL JOIN order_details WHERE orders.complete = '0' ORDER BY date, user_id, order_id;`;
  pool.query(order_query, (error, result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      console.log("result.rows order management = ",result.rows);
      res.render('pages/order_management.ejs',result);
    }
  });
});

app.post('/fulfill_order', function (req, res) {
  var order_id = req.body.order_id;
  var fulfill_order_query = `UPDATE orders SET complete = '1' WHERE order_id = '${order_id}';`;
  pool.query(fulfill_order_query, (error, result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      console.log(result.rows);
      res.redirect('/order_management');
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
      res.redirect("/error");
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
      console.log(error);
res.redirect("/error");
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
      console.log(error);
      res.redirect("/error");
    }
    else {
      res.redirect('/menu');
    }
  });
});
app.post('/food_menu_remove', function (req, res) {
  var menuItemRemove = req.body.food_item; //temporary
  var menuRemoveQuery = `DELETE FROM foodmenu WHERE item = '${menuItemRemove}';`;
  pool.query(menuRemoveQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      res.redirect('/menu');
    }
  });
});
app.post('/drink_menu_remove', function (req, res) {
  var menuItemRemove = req.body.drink_item; //temporary
  var menuRemoveQuery = `DELETE FROM drinkmenu WHERE item = '${menuItemRemove}';`;
  pool.query(menuRemoveQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.redirect("/error");
    }
    else {
      res.redirect('/menu');
    }
  });
});

app.post('/upload_image', async function (req, res) {
  //check if req.body.img is a binary or base64. If not, convert it
  var img = req.body.imgBase64;
  console.log("img: ", img); // UNDEFINED

  var requestOptions = {method: "POST",
                        // Token: "6f493c6ea4806759308a2e53c2cd8e123204160e",
                        headers: {
                          Authorization: "Client-ID 45d3e08f6d057e0" //change to ENV in prod
                        },
                        body: {image: req.body.img},
                        redirect: "follow"};

  var data;
  await fetch("https://api.imgur.com/3/upload", requestOptions).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('data fetch failed 1, status: ' + response.status); //this gets thrown
    }
  })
  .then((responseJson) => {
    //handle responseJson
    console.log("responseJson: ", responseJson);
    data = responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
  console.log("data: ", data);


  //grab deletehash from the fetch, and add it to the album

  requestOptions = {method: "POST",
                        // Token: "6f493c6ea4806759308a2e53c2cd8e123204160e",
                        headers: {
                          Authorization: "Client-ID 45d3e08f6d057e0" //change to ENV in prod
                        },
                        body: {'deletehashes[]': "aa"/*image deletehash*/}, 
                        redirect: "follow"};

  await fetch("https://api.imgur.com/3/album/kX13zMtvFfWIIau/add", requestOptions).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('data fetch failed, status: ' + response.status);
    }
  })
  .then((responseJson) => {
    //handle responseJson
    console.log(responseJson);
    data = responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
  console.log(data);
  
  res.send(data); //REPLACE WITH WHATEVER REDIRECT I WANT TO DO
});

app.get("/get_images", async (req, res) => {
  var requestOptions = {method: "GET",
                        headers: {
                          Authorization: "Client-ID 45d3e08f6d057e0" //change to ENV in prod
                        },
                        redirect: "follow"};

  var data;
  await fetch("https://api.imgur.com/3/album/bNH4P4d/images", requestOptions).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('data fetch failed, status: ' + response.status);
    }
  })
  .then((responseJson) => {
    //handle responseJson
    console.log(responseJson);
    data = responseJson;
  })
  .catch((error) => {
    console.log(error);
  });
  console.log(data);

  res.send(data);
});


app.post('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/error', (req,res) => {
  res.render('pages/error.ejs');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));