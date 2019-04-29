// Load required models
const User = require("../models/user");
const Order = require("../models/order");
const emailService = require("../utils/emailService");

exports.getAllUsers = (req, res, next) => {
  if (req.user.isAdmin) {
    User.find()
      .then(users => {
        return res.json(users);
      })
      .catch(err => console.log(err));
  } else {
    return res.status(403).send("User is not authorized");
  }
};

exports.postActivateUser = (req, res, next) => {
  if (req.user.isAdmin) {
    const activeUserId = req.body.activeUserId;
    User.findByIdAndUpdate(
      activeUserId,
      {
        $set: { isActive: true }
      },
      function(err, user) {
        if (err) {
          console.log(err);
        }
        return res.json(200, user);
      }
    );
  } else {
    return res.status(403).send("User is not authorized");
  }
};

exports.postDeactivateUser = (req, res, next) => {
  if (req.user.isAdmin) {
    const deactivateUserId = req.body.deactivateUserId;
    User.findByIdAndUpdate(
      deactivateUserId,
      {
        $set: { isActive: false }
      },
      function(err, user) {
        if (err) {
          console.log(err);
        }
        return res.json(200, user);
      }
    );
  } else {
    return res.status(403).send("User is not authorized");
  }
};

exports.getInProgressOrders = (req, res, next) => {
  if (req.user.isAdmin) {
    Order.find({ inProgress: true })
      .then(orders => {
        return res.json(orders);
      })
      .catch(err => console.log(err));
  } else {
    return res.status(403).send("User is not authorized");
  }
};

exports.postRejectOrder = (req, res, next) => {
  if (req.user.isAdmin) {
    const rejectedOrderId = req.body.rejectedOrderId;
    Order.findByIdAndUpdate(
      rejectedOrderId,
      {
        $set: { isRejected: true }
      },
      function(err, order) {
        if (err) {
          console.log(err);
        }
        emailService
          .sendEmail(
            order.user.email,
            "shop@iot.com",
            "Reject Order",
            `Order ${order._id} is rejected`
          )
          .then(() => {
            return res.json(200, order);
          })
          .catch(err => console.log(err));
      }
    );
  } else {
    return res.status(403).send("User is not authorized");
  }
};
