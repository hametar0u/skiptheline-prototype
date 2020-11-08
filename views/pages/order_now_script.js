var cart = {"cart_items": [], "item_amount": 0, "total_cost":0.00};
  
function add_to_cart(i) {
  var menuItemName = document.getElementById('menuItemName' + i.toString()).textContent;
  var menuItemPrice = document.getElementById("menuItemPrice" + i.toString()).textContent;
  var menuItemQuantity = document.getElementById("menuItemQuantity" + i.toString()).value;
  var menuItemDate = document.getElementById("dates").value;
  console.log("menu item name = " + menuItemName);
  console.log("menu item price = " + menuItemPrice);
  console.log("menu item quantity = " + menuItemQuantity);
  console.log("menu item date = " + menuItemDate);

  var itemObject = {"item":"", "price": 0, "quantity": 0, "date": ""};
  var existsFlag = false;

  if (menuItemQuantity !=0) {
    for (var n = 0; n < cart.item_amount; n++) {
      if (cart.cart_items[n].item == menuItemName && cart.cart_items[n].date == menuItemDate) {
        var itemQuantity = parseInt(cart.cart_items[n].quantity);
        itemQuantity += parseInt(menuItemQuantity);
        itemQuantity = itemQuantity.toString();
        cart.cart_items[n].quantity = itemQuantity;
        existsFlag = true;

        break;
      }
    }

    if (existsFlag == false) {
      itemObject.item = menuItemName;
      itemObject.price = menuItemPrice;
      itemObject.quantity = menuItemQuantity;
      itemObject.date = menuItemDate;

      cart.cart_items[cart.item_amount] = itemObject;
      cart.item_amount++;

    }
  }
  else{
    window.alert("Please provide a quantity.")
  }

  cart.total_cost = 0.00;
  for (var n = 0; n < cart.item_amount; n++) {
    cart.total_cost += cart.cart_items[n].price * cart.cart_items[n].quantity;

  }
  cart.total_cost = cart.total_cost.toFixed(2);
  document.getElementById("totalCost").innerHTML = `Total: ${cart.total_cost}`; 

  // console.log(itemObject);
  // console.log(cart);

  //update cart after someone adds stuff to it
  displayCart();
}

function sendData() {
  var cart_items = cart;
  console.log("cart_items = ",cart_items);
  fs.writeFile('logs.txt',cart_items,'utf8',callback);
  var xhr = new window.XMLHttpRequest();
  xhr.open('POST', '/confirm_order', true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(cart_items));
}

// Access the form element...
const form = document.getElementById( "confirmOrderForm" );

// ...and take over its submit event.
form.addEventListener( "submit", function ( event ) {
  event.preventDefault();
  if (cart.item_amount == 0) {
    alert("There are no items in the cart!");
  }
  else {
    sendData();
    console.log("order sent");
    window.location.replace(window.location.origin+"/confirm_order_load");
  }
  
} );

function displayCart() {
  if (document.getElementById("displayTable") != null) {
    document.getElementById("displayTable").remove();
  }
  var div = document.getElementById("display_cart");
  var tbl = document.createElement("table");
  tbl.setAttribute("id", "displayTable");

  for (var i = 0; i< cart.item_amount; i++) {
    var tr = document.createElement("tr");

    var tdItem = document.createElement("td");
    var itemText = document.createTextNode(cart.cart_items[i].item);
    tdItem.appendChild(itemText);

    var tdPrice = document.createElement("td");
    var priceText = document.createTextNode(cart.cart_items[i].price);
    tdPrice.appendChild(priceText);
    
    var tdQuantity = document.createElement("td");
    var quantityText = document.createTextNode(cart.cart_items[i].quantity);
    tdQuantity.appendChild(quantityText);
  
    var tdDate = document.createElement("td");
    var dateText = document.createTextNode(cart.cart_items[i].date);
    tdDate.appendChild(dateText);

    var tdButton = document.createElement("td");
    var button = document.createElement("button");
    button.setAttribute("onClick",`removeCartItem('${i}')`);
    button.textContent = "Remove";
    tdButton.appendChild(button);

    tr.appendChild(tdItem);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdDate);
    tr.appendChild(tdButton);

    tbl.appendChild(tr);
  }
  div.appendChild(tbl);
}

function removeCartItem(i) {
  cart.cart_items.splice(parseInt(i),1);
  cart.item_amount -= 1;
  displayCart()
}
