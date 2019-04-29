const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const orderQueue = require("../queue/orderQueue");

const keys = require("../config/keys");
const Order = require("../models/order");
const emailService = require("../utils/emailService");

// Load Input Validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User model
const User = require("../models/user");

exports.test = (req, res, next) => res.json({ msg: "Users Works" });

exports.register = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        cart: { items: [] }
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(200).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
};

exports.login = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, role: user.role }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
};

exports.current = (req, res, next) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }
        };
      });
      const order = new Order({
        products: products,
        user: {
          email: req.user.email,
          userId: req.user
        }
      });

      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => {
      emailService
        .sendEmail(
          order.user.email,
          "shop@iot.com",
          "Reject Order",
          `Order ${order._id} is created`
        )
        .then(() => {
          orderQueue.create(order, err => {
            if (err) {
              return res.json({
                error: err,
                success: false,
                message: "Could not create order in job"
              });
            } else {
              return res.json({
                error: null,
                success: true,
                message: "Successfully created order in job",
                order
              });
            }
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const pageNo = parseInt(req.query.pageNo);
  const size = parseInt(req.query.size);
  let totalOrders;
  Order.find({ "user.userId": req.user.id })
    .count()
    .then(totalItems => {
      totalOrders = totalItems;
      return Order.find({ "user.userId": req.user.id })
        .skip((pageNo - 1) * size)
        .limit(size)
        .catch(err => console.log(err));
    })
    .then(orders => {
      res.json({
        orders: orders,
        totalItems: totalOrders,
        hasNextPage: size * pageNo < totalOrders,
        hasPreviousPage: pageNo > 1,
        nextPage: pageNo + 1,
        previousPage: pageNo - 1,
        lastPage: Math.ceil(totalOrders / size)
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items;
      return res.json(products);
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      emailService
        .sendEmail(
          order.user.email,
          "shop@iot.com",
          "Reject Order",
          `Product ${prodId} is Removed`
        )
        .then(() => {
          return res.json("Product Removed from cart");
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      console.log(err);
    });
};
