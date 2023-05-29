const express = require("express");
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const auth_router = require('./routes/auth');
const user_router = require('./routes/user');
const post_router = require('./routes/post');
dotenv.config();

const app = express();

app.use(express.json());

app.use("/userApi", auth_router);

app.use("/userApi/user", user_router);

app.use("/userApi/posts", post_router);



const initializeDbAndServer = async () => {
  try {
    app.listen(5000, () =>
      console.log(`Server Running at http://localhost:${5000}/`)
    );
    await mongoose.connect(process.env._MONGO_URI);
  } catch (error) {
    console.log(`DB Error:${error.message}`);
  }
};

initializeDbAndServer();









 




