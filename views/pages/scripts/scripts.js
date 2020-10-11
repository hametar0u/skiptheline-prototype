var addToCart = function(item_name){
    var price = document.getElementById(`${item_name}_price`).value;
    var amount = document.getElementById(`${item_name}_quantity`).value;
    var itemObject = {
        name: item_name,
        price: parseFloat(price),
        amount: parseInt(amount)
    }

    cart.addItem(itemObject);

    return;
};

var storage = {
    getCart: function(){
        return JSON.parse(localStorage.getItem("cart"));
    },
    saveCart: function(cart){
        var cart_string = JSON.stringify(cart);
        localStorage.setItem("cart", cart_string);
        return;
    },
    clearCart: function(){
        localStorage.removeItem("cart");
        return;
    }
};

var cart = {
    item_amount: 0,
    total_price: 0,
    items: [],          //item = {name, price, amount}
    updateAmountAndPrice: function(){
        total = 0;
        cart_items = this.items
        for (var i = 0; i < this.items.length; i++){
            total += (cart_items[i].price * cart_items[i].amount);
        }
        this.total_price = total;
        this.item_amount = this.items.length;
        return;
    },
    getItems: function(){
        return this.items;
    },
    loadItems: function(items){
        this.items = items;
        return;
    },
    hasItem: function(name){
        if (this.items === undefined){
            return -1;
        }

        for (var i = 0; i < this.items.length; i++){
            if (name == this.items[i].name){
                return i;
            }
        }
        return -1;
    },
    updateItem: function(item){
        var i = this.hasItem(item.name);
        this.items[i].amount = item.amount;
        return;
    },
    addItem: function(item){
        if (this.hasItem(item.name) === -1){
            this.items.push({
                name: item.name,
                price: item.price,
                amount: item.amount
            });
            this.item_amount += 1;
        }
        else {
            this.updateItem(item);
        }
        this.updateAmountAndPrice();
        storage.saveCart(this.items)
        return;
    },
    clearItems: function(){
        this.items = [];
        this.total = 0;
        this.item_amount = 0;
        return;
    }
};