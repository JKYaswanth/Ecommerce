
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://localhost:27017/Ecommerce")
.then(()=>{
    console.log('Mongodb Connected.');
})
.catch((error)=>{
    console.log('Error in connecting with Mongodb: ',error);
})

// Cart Collection Schema
const CartSchema = new Schema({
    Cart_id: { type: String, required: true, unique: true }
});
const Cart = mongoose.model('Cart', CartSchema);

// Customer Collection Schema
const CustomerSchema = new Schema({
    Username: { type: String, required: true, unique: true },
    Cart_id: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true }
});
CustomerSchema.index({ Cart_id: 1 });
CustomerSchema.index({ Username: 1 }, { unique: true });

const Customer = mongoose.model('Customer', CustomerSchema);

// Seller Collection Schema
const SellerSchema = new Schema({
    Seller_name: { type: String, required: true, unique: true },
    Seller_Email: { type: String, required: true },
    Password: { type: String, required: true }
});
const Seller = mongoose.model('Seller', SellerSchema);

// Seller_Phone_num Collection Schema
const SellerPhoneSchema = new Schema({
    Phone_num: { type: Number, required: true },
    Seller_Email: { type: String, required: true }
});
SellerPhoneSchema.index({ Phone_num: 1, Seller_name: 1 }, { unique: true });
const SellerPhone = mongoose.model('SellerPhone', SellerPhoneSchema);

// Payment Collection Schema
const PaymentSchema = new Schema({
    payment_id: { type: String, required: true, unique: true },
    Customer_id: { type: String, required: true },
    Cart_id: { type: String, required: true },
    Address: {type: String, required: true}
});
PaymentSchema.index({ Customer_id: 1 });
PaymentSchema.index({ Cart_id: 1 });
PaymentSchema.index({Address: 1});
const Payment = mongoose.model('Payment', PaymentSchema);

// Product Collection Schema
const ProductSchema = new Schema({
    Product_id: { type: String, required: true, unique: true },
    Seller_name: { type: String, required: true },
    Price: { type: Number, required: true },
    Category: {type: String, required: true},
    Enum: {type: Number}

});
ProductSchema.index({ Seller_name: 1 });
const Product = mongoose.model('Product', ProductSchema);

// Cart_item Collection Schema
const CartItemSchema = new Schema({
    Cart_id: { type: String, required: true },
    Product_id: { type: String, required: true }
});
CartItemSchema.index({ Cart_id: 1, Product_id: 1 }, { unique: true });
CartItemSchema.index({ Product_id: 1 });
const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = { Cart, Customer, Seller, SellerPhone, Payment, Product, CartItem };

app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/register.html");
});

app.get("/customer.html", function(req, res) {
    res.sendFile(__dirname + "/customer.html");
});

app.get("/business.html", function(req, res) {
    res.sendFile(__dirname + "/business.html");
});

app.get("/login.html", function(req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.get("/register.html", function(req, res) {
    res.sendFile(__dirname + "/register.html");
});

app.get("/trolley-cart.png", function(req, res) {
    res.sendFile(__dirname + "/trolley-cart.png");
});

app.post("/login.html", async function(req, res) {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ Email: email });
        const seller = await Seller.findOne({ Seller_Email: email });

        if (customer && seller) {
            if (customer.Password === password && seller.Password === password) {
                // Passwords match for both customer and seller
                res.status(401).send("Ambiguous account: Same email exists as both Customer and Seller");
            } else if (customer.Password === password) {
                // Password matches for Customer
                res.redirect("/customer.html");
            } else if (seller.Password === password) {
                // Password matches for Seller
                res.redirect("/business.html");
            } else {
                // Passwords don't match for both collections
                res.status(401).send("Incorrect password for both Customer and Seller");
            }
        } else if (customer) {
            // Email found only in Customer collection
            if (customer.Password === password) {
                res.redirect("/customer.html");
            } else {
                throw new Error("Incorrect password for Customer");
            }
        } else if (seller) {
            // Email found only in Seller collection
            if (seller.Password === password) {
                res.redirect("/business.html");
            } else {
                throw new Error("Incorrect password for Seller");
            }
        } else {
            // Email not found in both collections
            throw new Error("Email not found in both Customer and Seller collections");
        }
    } catch (error) {
        res.status(401).send(error.message);
    }
});



app.post("/", function(req, res) {
    const { username, email, password, category } = req.body;

    if (category === 'Customer') {
        let newCustomer = new Customer({
            Username: username,
            Email: email,
            Password: password,
            Cart_id: username
        });

        newCustomer.save()
            .then(() => {
                res.redirect("/customer.html");
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error saving customer data");
            });
    } else if (category === 'Business') {
        let newSeller = new Seller({
            Seller_name: username,
            Seller_Email: email,
            Password: password
        });

        newSeller.save()
            .then(() => {
                res.redirect("/business.html");
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error saving business data");
            });
    } else {
        res.send("Invalid category");
    }
});



// app.listen(3000, function(){
//     console.log("Server is running on 3000");
// })
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});