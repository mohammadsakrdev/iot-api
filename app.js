const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const kue = require("kue");

const userRoutes = require("./routes/api/user");
const adminRoutes = require("./routes/api/admin");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Passport middleware
app.use(passport.initialize());

app.use("/queue", kue.app);

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.log(err));
