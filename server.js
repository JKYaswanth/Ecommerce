
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
    Email: { type: String, required: true,},
    Product_name: { type: String, required: true,},
    Seller_Email: { type: String, required: true },
    Enum: {type: Number}

});
const Cart = mongoose.model('Cart', CartSchema);

// Customer Collection Schema
const CustomerSchema = new Schema({
    Username: { type: String, required: true, unique: true },
    // Cart_id: { type: String, required: true },
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
    Product_name: { type: String, required: true, unique: true },
    Seller_Email: { type: String, required: true },
    Price: { type: Number, required: true },
    Category: {type: String, required: true},
    Enum: {type: Number}

});
ProductSchema.index({ Seller_Email: 1 });
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

app.get("/add_icon.png", function(req, res) {
    res.sendFile(__dirname + "/add_icon.png");
});

app.get("/cart.html", function(req, res) {
    res.sendFile(__dirname + "/cart.html");
});

app.get("/modify_cart.html", function(req, res) {
    res.sendFile(__dirname + "/modify_cart.html");
});


app.get("/add_prod.html", function(req, res) {
    const sellerEmail = req.query.seller_email;
    res.sendFile(__dirname + "/add_prod.html"); // Corrected path
});

app.get('/prod', async (req, res) => {
    try {
        const products = await Product.find({}).lean(); // Retrieve all products
        res.json(products); // Send products as JSON response
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const sellerEmail = req.query.seller_email;
        const products = await Product.find({ Seller_Email: sellerEmail });

        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'No products found for this seller' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    }
});


// app.get('/business.html/?seller_email', async (req, res) => {
//     try {
//         const sellerEmail = req.params.seller_email;
//         const products = await Product.find({ Seller_Email: sellerEmail });

//         if (products.length > 0) {
//             res.json(products);
//         } else {
//             res.status(404).json({ error: 'No products found for this seller' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch products', message: error.message });
//     }
// });



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
                res.redirect(`/customer.html?email=${customer.Email}`);
            } else if (seller.Password === password) {
                // Password matches for Seller
                // res.redirect("/business.html");
                res.redirect(`/business.html?seller_email=${seller.Seller_Email}`);

            } else {
                // Passwords don't match for both collections
                res.status(401).send("Incorrect password for both Customer and Seller");
            }
        } else if (customer) {
            // Email found only in Customer collection
            if (customer.Password === password) {
                // res.redirect("/customer.html");
                res.redirect(`/customer.html?email=${customer.Email}`);
            } else {
                throw new Error("Incorrect password for Customer");
            }
        } else if (seller) {
            // Email found only in Seller collection
            if (seller.Password === password) {
                res.redirect(`/business.html?seller_email=${seller.Seller_Email}`);
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

// app.post("/add_prod.html", async (req, res) => {
//     try {
//         const { type, Prod_name,seller_email,price, category, enumeration } = req.body;

//         if (type === 'add_product') {
//             // let Email1 = req.query.seller_email;
//             // Logic for adding a new product
//             const newProduct = new Product({
//                 Product_name: Prod_name,
//                 Seller_Email: seller_email,
//                 Price: price,
//                 Category: category,
//                 Enum: enumeration
//             });
//             await newProduct.save();
//             res.status(201).json({ message: 'Product added successfully' });
//         } else if (type === 'update_product') {
//             // Logic for updating a product
//             // Implement update product logic here
//             res.status(200).json({ message: 'Product updated successfully' });
//         } else if (type === 'remove_product') {
//             // Logic for removing a product
//             // Implement remove product logic here
//             res.status(200).json({ message: 'Product removed successfully' });
//         } else {
//             // Handle cases for other types or show an error message
//             res.status(400).json({ error: 'Invalid type selected' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to process request', message: error.message });
//     }
// });

// app.post("/add_prod.html", async (req, res) => {
//     try {
//         const { type, Prod_name, seller_email, price, category, enumeration } = req.body;

//         if (type === 'add_product') {
//             // Logic for adding a new product
//             const newProduct = new Product({
//                 Product_name: Prod_name,
//                 Seller_Email: seller_email,
//                 Price: price,
//                 Category: category,
//                 Enum: enumeration
//             });
//             await newProduct.save();
//             res.status(201).json({ message: 'Product added successfully' });
//         } else if (type === 'update_product') {
//             const { category, price, enumeration } = req.body;
//             // Logic for updating a product
//             await Product.findOneAndUpdate(
//                 { Product_name: Prod_name },
//                 { $set: { Category: category, Price: price, Enum: enumeration } },
//                 { new: true }
//             );
//             res.status(200).json({ message: 'Product updated successfully' });
//         } else if (type === 'remove_product') {
//             // Logic for removing a product
//             await Product.deleteOne({ Product_name: Prod_name });
//             res.status(200).json({ message: 'Product removed successfully' });
//         } else {
//             // Handle cases for other types or show an error message
//             res.status(400).json({ error: 'Invalid type selected' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to process request', message: error.message });
//     }
// });

app.post("/add_prod.html", async (req, res) => {
    try {
        const { type, Prod_name, seller_email, price, category, enumeration } = req.body;

        if (type === 'add_product') {
            // Logic for adding a new product
            const newProduct = new Product({
                Product_name: Prod_name,
                Seller_Email: seller_email,
                Price: price,
                Category: category,
                Enum: enumeration
            });
            await newProduct.save();
            res.status(201).json({ message: 'Product added successfully' });
        } else if (type === 'update_product') {
            const { category, price, enumeration } = req.body;
            // Logic for updating a product
            const updatedProduct = await Product.findOneAndUpdate(
                { Product_name: Prod_name },
                { $set: { Category: category, Price: price, Enum: enumeration } },
                { new: true }
            );
            if (updatedProduct) {
                res.status(200).json({ message: 'Product updated successfully' });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } else if (type === 'remove_product') {
            // Logic for removing a product
            const deletedProduct = await Product.deleteOne({ Product_name: Prod_name });
            if (deletedProduct.deletedCount > 0) {
                res.status(200).json({ message: 'Product removed successfully' });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } else {
            // Handle cases for other types or show an error message
            res.status(400).json({ error: 'Invalid type selected' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to process request', message: error.message });
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
                res.redirect(`/customer.html?email=${customer.Email}`);
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
                // res.redirect("/business.html");
                res.redirect(`/business.html?seller_name=${newSeller.Seller_name}`);

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