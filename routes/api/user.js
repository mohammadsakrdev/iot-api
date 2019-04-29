const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../../controllers/user");

// @route   GET api/user/test
// @desc    Tests users route
// @access  Public
router.get("/test", userController.test);

// @route   GET api/user/register
// @desc    Register user
// @access  Public
router.post("/register", userController.register);

// @route   GET api/user/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", userController.login);

// @route   GET api/user/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  userController.current
);

// @route   POST api/user/order
// @desc    Create new order
// @access  Private
router.post(
  "/order",
  passport.authenticate("jwt", { session: false }),
  userController.postOrder
);

// @route   GET api/user/orders
// @desc    Return current user
// @access  Private
router.get(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  userController.getOrders
);

// @route   GET api/user/cart
// @desc    Return current user
// @access  Private
router.get(
  "/cart",
  passport.authenticate("jwt", { session: false }),
  userController.getCart
);

// @route   GET api/user/cart-delete-item
// @desc    Return current user
// @access  Private
router.get(
  "/cart-delete-item",
  passport.authenticate("jwt", { session: false }),
  userController.postCartDeleteProduct
);

module.exports = router;
