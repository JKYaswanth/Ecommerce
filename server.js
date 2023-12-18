
// const express = require("express");
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const bodyParser = require("body-parser");


// mongoose.connect("mongodb://localhost:27017/Ecommerce")
// .then(()=>{
//     console.log('Mongodb Connected.');
// })
// .catch((error)=>{
//     console.log('Error in connecting with Mongodb: ',error);
// })

// // Cart Collection Schema
// const CartSchema = new Schema({
//     Cart_id: { type: String, required: true, unique: true }
// });
// const Cart = mongoose.model('Cart', CartSchema);

// // Customer Collection Schema
// const CustomerSchema = new Schema({
//     Customer_id: { type: String, required: true, unique: true },
//     Cart_id: { type: String, required: true },
//     Phone_number_s: { type: Number, required: true }
// });
// CustomerSchema.index({ Cart_id: 1 });
// CustomerSchema.index({ Phone_number_s: 1 });
// const Customer = mongoose.model('Customer', CustomerSchema);

// // Seller Collection Schema
// const SellerSchema = new Schema({
//     Seller_id: { type: String, required: true, unique: true }
// });
// const Seller = mongoose.model('Seller', SellerSchema);

// // Seller_Phone_num Collection Schema
// const SellerPhoneSchema = new Schema({
//     Phone_num: { type: Number, required: true },
//     Seller_id: { type: String, required: true }
// });
// SellerPhoneSchema.index({ Phone_num: 1, Seller_id: 1 }, { unique: true });
// const SellerPhone = mongoose.model('SellerPhone', SellerPhoneSchema);

// // Payment Collection Schema
// const PaymentSchema = new Schema({
//     payment_id: { type: String, required: true, unique: true },
//     Customer_id: { type: String, required: true },
//     Cart_id: { type: String, required: true }
// });
// PaymentSchema.index({ Customer_id: 1 });
// PaymentSchema.index({ Cart_id: 1 });
// const Payment = mongoose.model('Payment', PaymentSchema);

// // Product Collection Schema
// const ProductSchema = new Schema({
//     Product_id: { type: String, required: true, unique: true },
//     Seller_id: { type: String, required: true }
// });
// ProductSchema.index({ Seller_id: 1 });
// const Product = mongoose.model('Product', ProductSchema);

// // Cart_item Collection Schema
// const CartItemSchema = new Schema({
//     Cart_id: { type: String, required: true },
//     Product_id: { type: String, required: true }
// });
// CartItemSchema.index({ Cart_id: 1, Product_id: 1 }, { unique: true });
// CartItemSchema.index({ Product_id: 1 });
// const CartItem = mongoose.model('CartItem', CartItemSchema);

// module.exports = { Cart, Customer, Seller, SellerPhone, Payment, Product, CartItem };



// app.use(bodyParser.urlencoded({extended: true}));

// app.get("/", function(req,res){
//     res.send("Express is Working");
// })

// app.listen(3000, function(){
//     console.log("Server is running on 3000");
// })
// const PORT = 3000;
// app.listen(PORT, function () {
//   console.log(`Server is running on ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/Ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected.');
})
.catch((error) => {
  console.error('Error in connecting with MongoDB:', error);
});

// Define Schemas and Models
const Schema = mongoose.Schema;

// Cart Collection Schema and Model
const CartSchema = new Schema({
  Cart_id: { type: String, required: true, unique: true }
});
const Cart = mongoose.model('Cart', CartSchema);

// Customer Collection Schema and Model
const CustomerSchema = new Schema({
  Customer_id: { type: String, required: true, unique: true },
  Cart_id: { type: String, required: true },
  Phone_number_s: { type: Number, required: true }
});
CustomerSchema.index({ Cart_id: 1 });
CustomerSchema.index({ Phone_number_s: 1 });
const Customer = mongoose.model('Customer', CustomerSchema);

// ... Define other schemas and models similarly ...

// Seller Collection Schema
const SellerSchema = new Schema({
    Seller_id: { type: String, required: true, unique: true }
});
const Seller = mongoose.model('Seller', SellerSchema);

// Seller_Phone_num Collection Schema
const SellerPhoneSchema = new Schema({
    Phone_num: { type: Number, required: true },
    Seller_id: { type: String, required: true }
});
SellerPhoneSchema.index({ Phone_num: 1, Seller_id: 1 }, { unique: true });
const SellerPhone = mongoose.model('SellerPhone', SellerPhoneSchema);

// Payment Collection Schema
const PaymentSchema = new Schema({
    payment_id: { type: String, required: true, unique: true },
    Customer_id: { type: String, required: true },
    Cart_id: { type: String, required: true }
});
PaymentSchema.index({ Customer_id: 1 });
PaymentSchema.index({ Cart_id: 1 });
const Payment = mongoose.model('Payment', PaymentSchema);

// Product Collection Schema
const ProductSchema = new Schema({
    Product_id: { type: String, required: true, unique: true },
    Seller_id: { type: String, required: true }
});
ProductSchema.index({ Seller_id: 1 });
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

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", function(req, res) {
  res.send("Express is Working");
});

// Start Server
app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
});
