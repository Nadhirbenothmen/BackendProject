const express = require("express");
const bodyParser = require('body-parser');
const connectDB = require('./Helpers/db');
const jsonParser = bodyParser.json();
const cors = require('cors');
const morgan = require("morgan");
const app = express();

const port = process.env.PORT || 4000;
app.use(morgan("dev"));
app.use(cors());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// creé module

const authRouter = require('./routes/users');


app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Routers setup

app.use('/auth/', jsonParser, authRouter);


//Start the server
connectDB();

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
module.exports = app;
