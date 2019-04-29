const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, default: "member" },
  date: {
    type: Date,
    default: Date.now
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// methods ======================
// we have two type of methods: 'methods', and 'statics'.
// 'methods' are private to instances of the object User, which allows the use of 'this' keyword.
// 'statics' are attached to the user object, so that you don't need an instance of the object created with the keyword 'new' to actually call the function.

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.isMember = function() {
  return this.role === "member";
};

userSchema.methods.isAdmin = function() {
  return this.role === "admin";
};

userSchema.methods.isUserActive = function() {
  return this.isActive;
};

module.exports = User = mongoose.model("users", userSchema);
