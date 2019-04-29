const express = require("express");
const router = express.Router();
const passport = require("passport");

const adminController = require("../../controllers/admin");

// @route   GET api/admin/all-users
// @desc    Return all users
// @access  Private
router.get(
  "/all-users",
  passport.authenticate("jwt", { session: false }),
  adminController.getAllUsers
);

// @route   POST api/admin/activateUser
// @desc    Activate user
// @access  Private
router.post(
  "/activateUser",
  passport.authenticate("jwt", { session: false }),
  adminController.postActivateUser
);

// @route   POST api/admin/deactivateUser
// @desc    DeActivate user
// @access  Private
router.post(
  "/deactivateUser",
  passport.authenticate("jwt", { session: false }),
  adminController.postDeactivateUser
);

// @route   GET api/admin/inProgress-orders
// @desc    Return all users
// @access  Private
router.get(
  "/inProgress-orders",
  passport.authenticate("jwt", { session: false }),
  adminController.getInProgressOrders
);

// @route   POST api/admin/rejectOrder
// @desc    DeActivate user
// @access  Private
router.post(
  "/rejectOrder",
  passport.authenticate("jwt", { session: false }),
  adminController.postRejectOrder
);

module.exports = router;
